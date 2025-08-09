const Transaction = require('../models/transactions');
const Order = require('../models/order');
const SSLCommerzPayment = require('sslcommerz-lts');
const mongoose = require('mongoose');
require('dotenv').config();

// SSLCOMMERZ configuration
const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.NODE_ENV === 'production'; // true for live, false for sandbox

// Initiate payment (handles both online and cash payments)
const initiatePayment = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    // Validate required fields
    if (!orderId || !paymentMethod) {
      return res.status(400).json({ 
        message: 'Order ID and payment method are required' 
      });
    }

    // Validate payment method
    if (!['Online', 'Cash'].includes(paymentMethod)) {
      return res.status(400).json({ 
        message: 'Invalid payment method. Must be either "Online" or "Cash"' 
      });
    }

    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    // Get order details
    const order = await Order.findById(orderId)
      .populate('customerId', 'name email phoneNo');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if transaction already exists for this order
    const existingTransaction = await Transaction.findOne({ orderId });
    if (existingTransaction) {
      return res.status(400).json({ 
        message: 'Payment already initiated for this order' 
      });
    }

    if (paymentMethod === 'Cash') {
      // Handle cash payment
      const transaction = new Transaction({
        orderId,
        customerId: order.customerId._id,
        amount: order.totalAmount,
        paymentMethod: 'Cash',
        paymentStatus: 'Pending'
      });

      await transaction.save();

      return res.status(201).json({
        message: 'Cash payment initiated. Payment will be verified upon delivery.',
        transaction
      });
    }

    // Handle online payment with SSLCOMMERZ
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    // SSLCOMMERZ payment data
    const data = {
      total_amount: order.totalAmount,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${process.env.BASE_URL}/api/payment/success`,
      fail_url: `${process.env.BASE_URL}/api/payment/fail`,
      cancel_url: `${process.env.BASE_URL}/api/payment/cancel`,
      ipn_url: `${process.env.BASE_URL}/api/payment/ipn`,
      shipping_method: 'Delivery',
      product_name: 'Food Order',
      product_category: 'Food',
      product_profile: 'general',
      cus_name: order.customerId.name,
      cus_email: order.customerId.email,
      cus_add1: order.deliveryAddress,
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: order.customerId.phoneNo,
      ship_name: order.customerId.name,
      ship_add1: order.deliveryAddress,
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: '1000',
      ship_country: 'Bangladesh',
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    try {
      const apiResponse = await sslcz.init(data);

      if (apiResponse?.GatewayPageURL) {
        // Create transaction record
        const transaction = new Transaction({
          orderId,
          customerId: order.customerId._id,
          amount: order.totalAmount,
          paymentMethod: 'Online',
          paymentStatus: 'Pending',
          transactionId,
          sessionId: apiResponse.sessionkey,
          gatewayData: apiResponse
        });

        await transaction.save();

        return res.status(201).json({
          message: 'Online payment initiated successfully',
          paymentUrl: apiResponse.GatewayPageURL,
          transactionId,
          transaction
        });
      } else {
        return res.status(500).json({ 
          message: 'Failed to initiate online payment',
          error: apiResponse 
        });
      }
    } catch (sslError) {
      console.error('SSLCOMMERZ Error:', sslError);
      return res.status(500).json({ 
        message: 'Payment gateway error',
        error: sslError.message 
      });
    }

  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ 
      message: 'Error initiating payment', 
      error: error.message 
    });
  }
};

// Handle successful payment callback from SSLCOMMERZ
const paymentSuccess = async (req, res) => {
  try {
    const { tran_id, val_id } = req.body;

    if (!tran_id || !val_id) {
      return res.status(400).json({ message: 'Missing transaction details' });
    }

    // Validate payment with SSLCOMMERZ
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id });

    if (validation.status === 'VALID') {
      // Update transaction status
      const transaction = await Transaction.findOneAndUpdate(
        { transactionId: tran_id },
        { 
          paymentStatus: 'Completed',
          verifiedAt: new Date(),  // Set completion time for online payment
          gatewayData: validation 
        },
        { new: true }
      );

      if (transaction) {
        // Update order status
        await Order.findByIdAndUpdate(
          transaction.orderId,
          { status: 'Accepted' }
        );

        return res.status(200).json({
          message: 'Payment completed successfully',
          transaction
        });
      } else {
        return res.status(404).json({ message: 'Transaction not found' });
      }
    } else {
      return res.status(400).json({ 
        message: 'Payment validation failed',
        details: validation 
      });
    }

  } catch (error) {
    console.error('Payment success handler error:', error);
    res.status(500).json({ 
      message: 'Error processing successful payment', 
      error: error.message 
    });
  }
};

// Handle failed payment callback from SSLCOMMERZ
const paymentFail = async (req, res) => {
  try {
    const { tran_id } = req.body;

    if (tran_id) {
      await Transaction.findOneAndUpdate(
        { transactionId: tran_id },
        { paymentStatus: 'Failed' }
      );
    }

    res.status(200).json({ message: 'Payment failed' });
  } catch (error) {
    console.error('Payment failure handler error:', error);
    res.status(500).json({ 
      message: 'Error processing failed payment', 
      error: error.message 
    });
  }
};

// Handle cancelled payment callback from SSLCOMMERZ
const paymentCancel = async (req, res) => {
  try {
    const { tran_id } = req.body;

    if (tran_id) {
      await Transaction.findOneAndUpdate(
        { transactionId: tran_id },
        { paymentStatus: 'Failed' }
      );
    }

    res.status(200).json({ message: 'Payment cancelled' });
  } catch (error) {
    console.error('Payment cancellation handler error:', error);
    res.status(500).json({ 
      message: 'Error processing cancelled payment', 
      error: error.message 
    });
  }
};

// Verify cash payment (called by rider)
const verifyCashPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { riderId } = req.body;

    // Validate required fields
    if (!riderId) {
      return res.status(400).json({ message: 'Rider ID is required' });
    }

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(transactionId) || 
        !mongoose.Types.ObjectId.isValid(riderId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Find and update transaction
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.paymentMethod !== 'Cash') {
      return res.status(400).json({ 
        message: 'This transaction is not a cash payment' 
      });
    }

    if (transaction.paymentStatus === 'Verified') {
      return res.status(400).json({ 
        message: 'Payment already verified' 
      });
    }

    // Update transaction
    transaction.paymentStatus = 'Verified';
    transaction.verifiedBy = riderId;
    transaction.verifiedAt = new Date();

    await transaction.save();

    // Update order status to delivered
    await Order.findByIdAndUpdate(
      transaction.orderId,
      { 
        status: 'Delivered',
        deliveryTime: new Date()
      }
    );

    res.status(200).json({
      message: 'Cash payment verified successfully',
      transaction
    });

  } catch (error) {
    console.error('Cash payment verification error:', error);
    res.status(500).json({ 
      message: 'Error verifying cash payment', 
      error: error.message 
    });
  }
};

// Get transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const transaction = await Transaction.findById(id)
      .populate('orderId')
      .populate('customerId', 'name email')
      .populate('verifiedBy', 'name');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching transaction', 
      error: error.message 
    });
  }
};

// Get transactions by order ID
const getTransactionByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const transactions = await Transaction.find({ orderId })
      .populate('customerId', 'name email')
      .populate('verifiedBy', 'name');

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching transactions', 
      error: error.message 
    });
  }
};

// Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('orderId')
      .populate('customerId', 'name email')
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching transactions', 
      error: error.message 
    });
  }
};

module.exports = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  verifyCashPayment,
  getTransactionById,
  getTransactionByOrder,
  getAllTransactions
};
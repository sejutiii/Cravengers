const express = require('express');
const router = express.Router();

const {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  verifyCashPayment,
  getTransactionById,
  getTransactionByOrder,
  getAllTransactions
} = require('../controllers/paymentController');

// Initiate payment (both online and cash)
router.post('/initiate', initiatePayment);

// SSLCOMMERZ callback routes
router.post('/success', paymentSuccess);
router.post('/fail', paymentFail);
router.post('/cancel', paymentCancel);
router.post('/ipn', paymentSuccess); // IPN (Instant Payment Notification) uses same handler as success

// Verify cash payment (rider endpoint)
router.patch('/verify-cash/:transactionId', verifyCashPayment);

// Get transaction by ID
router.get('/:id', getTransactionById);

// Get transactions by order ID
router.get('/order/:orderId', getTransactionByOrder);

// Get all transactions
router.get('/', getAllTransactions);

module.exports = router;
const Order = require('../models/order');
const Rider = require('../models/rider');
const Menu = require('../models/menu');
const mongoose = require('mongoose');

// Create a new order and assign a rider
const createOrder = async (req, res) => {
  try {
    const { customerId, restaurantId, items, deliveryAddress} = req.body;
    
    // Validate required fields
    if (!customerId || !restaurantId || !items  || !deliveryAddress) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const menuItem = await Menu.findOne(
        { 'items._id': item.itemId },
        { 'items.$': 1 }
      );
      
      if (!menuItem || !menuItem.items[0]) {
        return res.status(404).json({ message: `Menu item with ID ${item.itemId} not found` });
      }
      
      totalAmount += menuItem.items[0].price * item.quantity;
    }
    
    // Create new order
    const order = new Order({
      customerId,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
    });    await order.save();

    // Assign a rider to the order
    const updatedOrder = await assignRider(order._id);
    if (!updatedOrder) {
      return res.status(404).json({ message: 'No available riders found' });
    }

    res.status(201).json({ message: 'Order created and rider assigned successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Assign a rider to an order
const assignRider = async (orderId) => {
  try {
    // Find an active rider with the least number of deliveries
    const rider = await Rider.findOne({ isActive: true })
      .sort({ deliveryCount: 1 }) // Sort by deliveryCount in ascending order
      .exec();

    if (!rider) {
      return null; // No available riders
    }

    // Update the order with the riderId
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { riderId: rider._id },
      { new: true }
    ).populate('customerId', 'name email')
     .populate('restaurantId', 'name')
     .populate('items.itemId', 'name price')
     .populate('riderId', 'name phoneNo');

    // Increment the rider's delivery count
    await Rider.findByIdAndUpdate(rider._id, { $inc: { deliveryCount: 1 } });

    return updatedOrder;
  } catch (error) {
    console.error('Error assigning rider:', error.message);
    return null;
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name')
      .populate('items.itemId', 'name price');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(id)
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name')
      .populate('items.itemId', 'name price');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Get orders by customer ID
const getOrderByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: 'Invalid customer ID' });
    }

    const orders = await Order.find({ customerId })
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name')
      .populate('items.itemId', 'name price');
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer orders', error: error.message });
  }
};

// Get orders by restaurant ID
const getOrderByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: 'Invalid restaurant ID' });
    }

    const orders = await Order.find({ restaurantId })
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name')
      .populate('items.itemId', 'name price');
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant orders', error: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    if (!['Pending', 'Accepted', 'In Progress', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByCustomer,
  getOrderByRestaurant,
  updateOrderStatus,
  assignRider
};
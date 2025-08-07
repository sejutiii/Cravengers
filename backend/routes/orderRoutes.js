const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByCustomer,
  getOrderByRestaurant,
  updateOrderStatus,
} = require('../controllers/orderController');

router.post('/', createOrder);

router.get('/', getAllOrders);

router.get('/:id', getOrderById);

router.get('/:customerId', getOrderByCustomer);

router.get('/:restaurantId', getOrderByRestaurant);

router.patch('/:id/status', updateOrderStatus);

module.exports = router;
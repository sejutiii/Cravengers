const express = require('express');
const { getRestaurantById, deleteRestaurantById, getAllRestaurants } = require('../controllers/restaurantController');
const router = express.Router();

router.get('/:id', getRestaurantById);
router.delete('/:id', deleteRestaurantById);
router.get('/', getAllRestaurants);

module.exports = router;

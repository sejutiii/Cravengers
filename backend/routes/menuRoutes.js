const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createMenuItems,
  updateMenuItem,
  deleteMenuItemsByRestaurant,
  deleteMenuItem,
  getMenuByRestaurant
} = require('../controllers/menuController');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
router.post('/', upload.array('images'), createMenuItems);
router.get('/:restaurantId', getMenuByRestaurant);
router.patch('/:restaurantId/items/:itemId', upload.single('image'), updateMenuItem);
router.delete('/restaurant/:restaurantId', deleteMenuItemsByRestaurant);
router.delete('/:restaurantId/items/:itemId', deleteMenuItem);

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createMenuItems,
  updateMenuItem,
  deleteMenuItemsByRestaurant,
  deleteMenuItem
} = require('../controllers/menuController');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
router.get('/:restaurantId', getMenuByRestaurant);
router.post('/', upload.array('images'), createMenuItems);
router.patch('/:restaurantId/items/:itemId', upload.single('image'), updateMenuItem);
router.delete('/restaurant/:restaurantId', deleteMenuItemsByRestaurant);
router.delete('/:restaurantId/items/:itemId', deleteMenuItem);

module.exports = router;
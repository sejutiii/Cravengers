require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const Menu = require('../models/menu');
const asyncHandler = require('express-async-handler');
const fs = require('fs').promises;

// Configure Cloudinary
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

// @desc    Get menu items for a restaurant
// @route   GET /api/menus/:restaurantId
// @access  Public
const getMenuByRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  // Find menu
  const menu = await Menu.findOne({ restaurantId }).select('items');
  if (!menu || menu.items.length === 0) {
    res.status(404);
    throw new Error('No menu items found for this restaurant');
  }

  res.status(200).json({
    success: true,
    data: menu.items
  });
});

// @desc    Create multiple menu items
// @route   POST /api/menus
// @access  Private (Restaurant Admin)
const createMenuItems = asyncHandler(async (req, res) => {
  const { restaurantId, items } = req.body;

  // Validate input
  if (!restaurantId || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Restaurant ID and an array of menu items are required');
  }

  // Process each item
  const validItems = await Promise.all(items.map(async (item, index) => {
    if (!item.name || !item.description || !item.price || !item.category) {
      throw new Error(`Menu item at index ${index} missing required fields: name, description, price, or category`);
    }

    let imageUrl = null;
    let tempFilePath = null;
    if (req.files && req.files[index] && req.files[index].path) {
      tempFilePath = req.files[index].path;
      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: `food-delivery/menus/${restaurantId}`,
        use_filename: true,
        unique_filename: false
      });
      imageUrl = result.secure_url;
      // Delete temporary file
      await fs.unlink(tempFilePath).catch(err => console.error(`Failed to delete temp file ${tempFilePath}:`, err));
    }

    return {
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl,
      isAvailable: item.isAvailable !== undefined ? item.isAvailable : true
    };
  }));

  // Find or create menu for restaurant
  let menu = await Menu.findOne({ restaurantId });
  if (!menu) {
    menu = new Menu({ restaurantId, items: [] });
  }

  // Append new items to existing items array
  menu.items.push(...validItems);
  await menu.save();

  res.status(201).json({
    success: true,
    data: menu.items
  });
});

// @desc    Update a menu item
// @route   PATCH /api/menus/:restaurantId/items/:itemId
// @access  Private (Restaurant Admin)
const updateMenuItem = asyncHandler(async (req, res) => {
  const { restaurantId, itemId } = req.params;
  const { name, description, price, category, isAvailable } = req.body;

  // Find menu
  const menu = await Menu.findOne({ restaurantId });
  if (!menu) {
    res.status(404);
    throw new Error('Menu not found for this restaurant');
  }

  // Find item in items array
  const item = menu.items.id(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  // Handle image update
  let imageUrl = item.imageUrl;
  let tempFilePath = null;
  if (req.files && req.files[0] && req.files[0].path) {
    // Delete old image from Cloudinary if it exists
    if (item.imageUrl) {
      const publicId = item.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`food-delivery/menus/${restaurantId}/${publicId}`);
    }
    // Upload new image
    tempFilePath = req.files[0].path;
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: `food-delivery/menus/${restaurantId}`,
      use_filename: true,
      unique_filename: false
    });
    imageUrl = result.secure_url;
    // Delete temporary file
    await fs.unlink(tempFilePath).catch(err => console.error(`Failed to delete temp file ${tempFilePath}:`, err));
  }

  // Update fields if provided
  if (name) item.name = name;
  if (description) item.description = description;
  if (price) item.price = price;
  if (category) item.category = category;
  if (imageUrl) item.imageUrl = imageUrl;
  if (isAvailable !== undefined) item.isAvailable = isAvailable;

  await menu.save();
  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Delete all menu items for a restaurant
// @route   DELETE /api/menus/restaurant/:restaurantId
// @access  Private (Restaurant Admin)
const deleteMenuItemsByRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  // Find menu
  const menu = await Menu.findOne({ restaurantId });
  if (!menu || menu.items.length === 0) {
    res.status(404);
    throw new Error('No menu items found for this restaurant');
  }

  // Delete images from Cloudinary
  await Promise.all(menu.items.map(async (item) => {
    if (item.imageUrl) {
      const publicId = item.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`food-delivery/menus/${restaurantId}/${publicId}`);
    }
  }));

  // Delete the entire menu document
  await Menu.deleteOne({ restaurantId });
  res.status(200).json({
    success: true,
    message: `Deleted menu with ${menu.items.length} items`
  });
});

// @desc    Delete a specific menu item
// @route   DELETE /api/menus/:restaurantId/items/:itemId
// @access  Private (Restaurant Admin)
const deleteMenuItem = asyncHandler(async (req, res) => {
  const { restaurantId, itemId } = req.params;

  // Find menu
  const menu = await Menu.findOne({ restaurantId });
  if (!menu) {
    res.status(404);
    throw new Error('Menu not found for this restaurant');
  }

  // Find item in items array
  const item = menu.items.id(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  // Delete image from Cloudinary if exists
  if (item.imageUrl) {
    const publicId = item.imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`food-delivery/menus/${restaurantId}/${publicId}`);
  }

  // Remove item from items array
  item.remove();
  await menu.save();

  res.status(200).json({
    success: true,
    message: 'Menu item deleted'
  });
});

module.exports = {
  getMenuByRestaurant,
  createMenuItems,
  updateMenuItem,
  deleteMenuItemsByRestaurant,
  deleteMenuItem
};
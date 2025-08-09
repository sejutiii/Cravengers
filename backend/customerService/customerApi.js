const express = require('express');
const { getCustomerById, deleteCustomerById, getAllCustomers } = require('../controllers/customerController');
const router = express.Router();

// Get customer details by _id
router.get('/:id', getCustomerById);

// Delete customer by _id
router.delete('/:id', deleteCustomerById);

// Get all customers
router.get('/', getAllCustomers);

module.exports = router;

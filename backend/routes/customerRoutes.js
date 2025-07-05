const express = require('express');
const { getCustomerById, deleteCustomerById, getAllCustomers } = require('../controllers/customerController');
const router = express.Router();

router.get('/:id', getCustomerById);
router.delete('/:id', deleteCustomerById);
router.get('/', getAllCustomers);

module.exports = router;

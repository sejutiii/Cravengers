const express = require('express');
const { getRiderById, deleteRiderById, getAllRiders } = require('../controllers/riderController');
const router = express.Router();

// Get rider details by _id
router.get('/:id', getRiderById);

// Delete rider by _id
router.delete('/:id', deleteRiderById);

// Get all riders
router.get('/', getAllRiders);

//Need to add a patch route for updating rider active status

module.exports = router;

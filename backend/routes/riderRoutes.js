const express = require('express');
const { getRiderById, deleteRiderById, getAllRiders } = require('../controllers/riderController');
const router = express.Router();

router.get('/:id', getRiderById);
router.delete('/:id', deleteRiderById);
router.get('/', getAllRiders);

module.exports = router;

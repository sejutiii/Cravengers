const express = require('express');
const Rider = require('../models/rider');
const router = express.Router();

// Get rider details by _id
router.get('/:id', async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).json({ error: 'Rider not found' });
    res.json(rider);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete rider by _id
router.delete('/:id', async (req, res) => {
  try {
    const result = await Rider.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Rider not found' });
    res.json({ message: 'Rider deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all riders
router.get('/', async (req, res) => {
  try {
    const riders = await Rider.find();
    res.json(riders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

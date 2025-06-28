const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Restaurant = require('../models/restaurant');
const Rider = require('../models/rider');
const bcrypt = require('bcryptjs');

router.post('/customer/login/', async (req, res) => {
  const { identifier, password } = req.body;
  let user = await Customer.findOne({ $or: [{ userName: identifier }, { email: identifier }] }) ||
             await Restaurant.findOne({ $or: [{ userName: identifier }, { email: identifier }] }) ||
             await Rider.findOne({ $or: [{ userName: identifier }, { email: identifier }] });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.verificationToken) return res.status(403).json({ error: 'Please verify your email first' });

  res.json({ message: 'Login successful', userType: user.constructor.modelName, userId: user.id });
});

module.exports = router;
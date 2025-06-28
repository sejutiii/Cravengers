const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const TempCustomer = require('../models/tempCustomer');
const Restaurant = require('../models/restaurant');
const TempRestaurant = require('../models/tempRestaurant');
const Rider = require('../models/rider');
const TempRider = require('../models/tempRider');

const userTypes = { customer: Customer, restaurant: Restaurant, rider: Rider };
const tempUserTypes = { customer: TempCustomer, restaurant: TempRestaurant, rider: TempRider };

router.post('/', async (req, res) => {
  const { userType, email, token } = req.body;

  if (userType === 'customer' || userType === 'restaurant' || userType === 'rider') {
    const TempModel = tempUserTypes[userType];
    const Model = userTypes[userType];
    const temp = await TempModel.findOne({ email, verificationToken: token });
    if (!temp) return res.status(400).json({ error: 'Invalid token or email' });
    // Prepare user data
    const userData = { ...temp._doc };
    delete userData._id;
    delete userData.verificationToken;
    delete userData.createdAt;
    const user = new Model(userData);
    await user.save();
    await TempModel.deleteOne({ email });
    return res.json({ message: 'Account verified and created successfully' });
  }

  if (!userTypes[userType]) return res.status(400).json({ error: 'Invalid user type' });

  const Model = userTypes[userType];
  const user = await Model.findOne({ email: email, verificationToken: token });

  if (!user) return res.status(400).json({ error: 'Invalid token or email' });

  user.verificationToken = null;
  await user.save();
  res.json({ message: 'Account verified successfully' });
});

module.exports = router;
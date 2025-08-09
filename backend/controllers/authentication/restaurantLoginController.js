const Restaurant = require('../../models/restaurant');
const bcrypt = require('bcryptjs');

exports.restaurantLogin = async (req, res) => {
  const { identifier, password } = req.body;
  const user = await Restaurant.findOne({ $or: [{ userName: identifier }, { email: identifier }] });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.verificationToken) return res.status(403).json({ error: 'Please verify your email first' });

  res.json({ message: 'Login successful', userType: 'Restaurant', userId: user._id });
};

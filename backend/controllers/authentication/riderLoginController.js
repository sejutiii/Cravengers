const Rider = require('../../models/rider');
const bcrypt = require('bcryptjs');

exports.riderLogin = async (req, res) => {
  const { identifier, password } = req.body;
  const user = await Rider.findOne({ $or: [{ userName: identifier }, { email: identifier }] });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.verificationToken) return res.status(403).json({ error: 'Please verify your email first' });

  res.json({ message: 'Login successful', userType: 'Rider', userId: user._id });
};

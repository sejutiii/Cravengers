const Rider = require('../models/rider');
const TempRider = require('../models/tempRider');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter setup failed:', error);
  } else {
    console.log('Email transporter is ready');
  }
});

const generateVerificationToken = () => Math.random().toString(36).substring(2, 15);

exports.riderSignUp = async (req, res) => {
  const { name, username, email, password, phoneNo, address } = req.body;

  const existingUsers = await Promise.all([
    require('../models/customer').findOne({ $or: [{ userName: username }, { email }] }),
    require('../models/restaurant').findOne({ $or: [{ userName: username }, { email }] }),
    Rider.findOne({ $or: [{ userName: username }, { email }] })
  ]);
  if (existingUsers.some(user => user)) return res.status(400).json({ error: 'Username or email already exists' });

  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = generateVerificationToken();

  await TempRider.findOneAndUpdate(
    { email },
    { userName: username, name, email, password: hashedPassword, phoneNo, address, verificationToken, createdAt: new Date() },
    { upsert: true }
  );

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    text: `Use this token to verify your account: ${verificationToken}`,
    html: `<strong>Use this token to verify your account: ${verificationToken}</strong>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
};

exports.getRiderById = async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).json({ error: 'Rider not found' });
    res.json(rider);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteRiderById = async (req, res) => {
  try {
    const result = await Rider.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Rider not found' });
    res.json({ message: 'Rider deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllRiders = async (req, res) => {
  try {
    const riders = await Rider.find();
    res.json(riders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

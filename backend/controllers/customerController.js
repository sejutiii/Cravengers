const Customer = require('../models/customer');
const TempCustomer = require('../models/tempCustomer');
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

exports.customerSignUp = async (req, res) => {
  const { name, username, email, password, phoneNo, address } = req.body;

  const existingUsers = await Promise.all([
    Customer.findOne({ $or: [{ userName: username }, { email }] }),
    require('../models/restaurant').findOne({ $or: [{ userName: username }, { email }] }),
    require('../models/rider').findOne({ $or: [{ userName: username }, { email }] })
  ]);
  if (existingUsers.some(user => user)) return res.status(400).json({ error: 'Username or email already exists' });

  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = generateVerificationToken();

  await TempCustomer.findOneAndUpdate(
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

exports.customerLogin = async (req, res) => {
  const Customer = require('../models/customer');
  const Restaurant = require('../models/restaurant');
  const Rider = require('../models/rider');
  const bcrypt = require('bcryptjs');
  const { identifier, password } = req.body;
  let user = await Customer.findOne({ $or: [{ userName: identifier }, { email: identifier }] }) ||
             await Restaurant.findOne({ $or: [{ userName: identifier }, { email: identifier }] }) ||
             await Rider.findOne({ $or: [{ userName: identifier }, { email: identifier }] });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.verificationToken) return res.status(403).json({ error: 'Please verify your email first' });

  res.json({ message: 'Login successful', userType: user.constructor.modelName, userId: user._id });
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteCustomerById = async (req, res) => {
  try {
    const result = await Customer.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

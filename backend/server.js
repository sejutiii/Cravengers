// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const customerApi = require('./customerService/customerApi');
const restaurantApi = require('./restaurantService/restaurantApi');
const riderApi = require('./riderService/riderApi');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // New payment routes

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to the Food Delivery App API');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerApi);
app.use('/api/restaurant', restaurantApi);
app.use('/api/rider', riderApi);
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes); // Payment routes

// Start the server using the port from environment variables
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
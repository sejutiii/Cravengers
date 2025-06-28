// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const customerSignUp = require('./authentication/customerSignUp');
const customerLogin = require('./authentication/customerLogin');
const restaurantSignUp = require('./authentication/restaurantSignUp');
const restaurantLogin = require('./authentication/restaurantLogin');
const riderSignUp = require('./authentication/riderSignUp');
const riderLogin = require('./authentication/riderLogin');
const verify = require('./authentication/verify');
const customerApi = require('./customerService/customerApi');
const restaurantApi = require('./restaurantService/restaurantApi');
const riderApi = require('./riderService/riderApi');

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

// Start the server using the port from environment variables
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());
app.use('/api/auth', customerSignUp);
app.use('/api/auth', customerLogin);
app.use('/api/auth', restaurantSignUp);
app.use('/api/auth', restaurantLogin);
app.use('/api/auth', riderSignUp);
app.use('/api/auth', riderLogin);
app.use('/api/auth/verify', verify);
app.use('/api/customer', customerApi);
app.use('/api/restaurant', restaurantApi);
app.use('/api/rider', riderApi);

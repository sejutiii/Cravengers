const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  favoriteRestaurants: { type: [String], maxItems: 3 }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
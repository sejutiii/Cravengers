const mongoose = require('mongoose');

const tempRestaurantSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cuisine: { type: String, required: true },
  phoneNo: { type: String, required: true },
  address: { type: String, required: true },
  openingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  verificationToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }
});

module.exports = mongoose.model('TempRestaurant', tempRestaurantSchema);

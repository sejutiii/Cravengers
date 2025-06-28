const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cuisine: { type: String, required: true },
  phoneNo: { type: String, required: true },
  address: { type: String, required: true },
  openingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  isOpen: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 5, default: 0 }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
const mongoose = require('mongoose');

const tempCustomerSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  verificationToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // expires in 10 minutes
}, { timestamps: true });

module.exports = mongoose.model('TempCustomer', tempCustomerSchema);

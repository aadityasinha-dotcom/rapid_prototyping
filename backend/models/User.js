const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  phone: String,
  otp: String,
  otpExpiration: Date,
});

module.exports = mongoose.model('User', userSchema);

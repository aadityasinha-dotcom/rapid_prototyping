const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type:String, required:true },
    email: { type:String , unique: true },
    password: {type:String ,required:true},
    phoneNumber: {type:Number , unique:true},
    numberOfTimesLoggedIn:{type:Number}
  } ,{timestamps:true});
  

  const User = mongoose.model('User', userSchema);

  module.exports = User;
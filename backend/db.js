const mongoose = require('mongoose');

function connect() {
    return new Promise((resolve, reject) => {
      mongoose.connect('mongodb://localhost/otp_verification', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      const db = mongoose.connection;
  
      db.on('error', error => {
        console.error('MongoDB connection error:', error);
        reject(error);
      });
  
      db.once('open', () => {
        console.log('Connected to MongoDB');
        resolve();
      });
    });
  }
  
module.exports = { connect };
  
const express = require('express');
const bodyParser = require('body-parser');
const { connect } = require('./db'); // Import the connect function from db.js
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);

// Connect to the database before starting the server
connect()
  .then(() => {
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to database:', error);
  });

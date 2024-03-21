const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, unique: true },
  },
  { timestamps: true }
);

const userSchemaSession = new mongoose.Schema(
  {
    username: { type: String, required: true },
    numberOfTimesLoggedIn: { type: Number },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const UserSession = mongoose.model("UserSession", userSchemaSession);

module.exports = { User, UserSession };

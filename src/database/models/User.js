// src/database/models/User.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  discordId: {
    type: String,
    required: true,
    unique: true, // Ensure Discord IDs are unique in the database
  },
  username: {
    type: String,
    required: true,
  },
  roles: [{
    type: String, // Could be role IDs or names, depending on how you want to manage them
    required: false, // Not all users may have roles initially
  }],
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set when a new user document is created
  },
  // Add additional fields as needed for your application
});

// Create a model from the schema
const User = mongoose.model('User', UserSchema);

module.exports = User;

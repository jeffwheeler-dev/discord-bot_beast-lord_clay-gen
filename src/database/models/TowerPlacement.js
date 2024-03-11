// src/database/models/TowerPlacement.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TowerPlacementSchema = new Schema({
  towerType: {
    type: String,
    required: true,
    enum: ['home', 'away'], // Specify that tower type can only be 'home' or 'away'
  },
  claySpent: {
    type: Number,
    required: true,
  },
  placedBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time when a new document is created
  }
});

// Create a model from the schema
const TowerPlacement = mongoose.model('TowerPlacement', TowerPlacementSchema);

module.exports = TowerPlacement;

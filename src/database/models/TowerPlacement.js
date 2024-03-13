// src/database/models/TowerPlacement.js

const mongoose = require('mongoose');

const towerPlacementSchema = new mongoose.Schema({
  channelId: { 
    type: String, 
    required: true 
  }, // The Discord channel ID associated with the alliance making the tower placement
  towerType: { 
    type: String, 
    required: true,
    enum: ['home', 'away'] // Assuming two types of towers: home and away
  },
  placedAt: { 
    type: Date, 
    default: Date.now // The date and time when the tower was placed
  },
  // You can add more fields relevant to tower placement, such as cost, location coordinates, etc.
});

const TowerPlacement = mongoose.model('TowerPlacement', towerPlacementSchema);

module.exports = TowerPlacement;

// src/database/models/Alliance.js

const mongoose = require('mongoose');

const allianceSchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true, index: true }, // Represents the Discord channel tied to the alliance
  allianceName: { type: String, required: true }, // Optional: A name for the alliance
  balance: { type: Number, required: true, default: 0 }, // If you want to track alliance balance directly within this model
  // Add other fields relevant to alliances, such as members (could be an array of userIds), achievements, etc.
});

const Alliance = mongoose.model('Alliance', allianceSchema);

module.exports = Alliance;

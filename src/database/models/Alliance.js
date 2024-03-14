// src/database/models/Alliance.js

const mongoose = require('mongoose');

const allianceSchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true, index: true }, // Represents the Discord channel tied to the alliance
  allianceName: { type: String, required: true }, // Optional: A name for the alliance
});

const Alliance = mongoose.model('Alliance', allianceSchema);

module.exports = Alliance;

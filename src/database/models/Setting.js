// src/database/models/Setting.js
const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  serverID: { type: String, required: true, unique: true },
  modRoleID: { type: String, required: false },
  // Add other settings as needed
});

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;

// src/database/models/Setting.js

const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  serverID: {
    type: String, 
    required: true,
    unique: true // Ensures settings are unique to each server
  },
  modRoleID: {
    type: String,
    required: false, // Optional, as not all servers might designate a mod role
  },
  channelID: {
    type: String, 
    required: true,
    unique: true // Ensures one primary channel per server's settings
  }
});

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;

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
  channelId: {
    type: String, 
    required: true,
    unique: true // Ensures one primary channel per server's settings
  },
  // You can keep the allianceId if you want settings to be tied to specific alliances
  // and if alliances are distinct entities within servers.
  // Otherwise, serverID alone might suffice for server-wide settings.
  allianceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, // Optional, depends on whether you're using alliances as separate entities
    ref: 'Alliance'
  },
  // Add other settings specific to servers or alliances
});

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;

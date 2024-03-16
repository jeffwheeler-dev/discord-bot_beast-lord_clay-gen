// models/Server.js
const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  serverId: { type: String, required: true, unique: true },
  serverName: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now },
  settings: {
    prefix: { type: String, default: '!' },
    // Add other customizable settings here
  },
  // You can expand this schema with more fields as needed.
});

module.exports = mongoose.model('Server', serverSchema);

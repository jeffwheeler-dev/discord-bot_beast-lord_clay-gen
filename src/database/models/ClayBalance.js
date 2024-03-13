// src/database/models/ClayBalance.js
const mongoose = require('mongoose');

const clayBalanceSchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true },
  balance: { type: Number, required: true, default: 0 },
});

const ClayBalance = mongoose.model('ClayBalance', clayBalanceSchema);

module.exports = ClayBalance;


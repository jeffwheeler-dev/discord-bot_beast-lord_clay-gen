const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ClayBalanceSchema = new Schema({
  balance: {
    type: Number,
    required: true,
    default: 0 // Start with a default balance of 0
  },
  dailyCapacity: {
    type: Number,
    required: true,
    default: 36000 // Assuming the daily capacity is a constant 36,000
  },
  lastUpdated: {
    type: Date,
    default: Date.now // Automatically set to the current date and time
  }
}, { timestamps: true }); // Include creation and update timestamps automatically

// Create a model from the schema
const ClayBalance = mongoose.model('ClayBalance', ClayBalanceSchema);

module.exports = ClayBalance;

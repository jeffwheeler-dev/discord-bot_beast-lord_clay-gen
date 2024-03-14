const mongoose = require('mongoose');

const towerSchema = new mongoose.Schema({
  allianceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alliance',
    required: true,
  },
  allianceName: {
    type: String,
    required: true,
  },
  homeTowerCount: {
    type: Number,
    required: true,
    default: 0,
  },
  awayTowerCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Tower = mongoose.model('Tower', towerSchema);

module.exports = Tower;

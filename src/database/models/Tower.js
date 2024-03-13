const mongoose = require('mongoose');

const towerSchema = new mongoose.Schema({
    channelId: {
        type: String,
        required: true,
    },
    allianceName: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    location: {
        type: String,
        required: true,
    },
    placedAt: {
        type: Date,
        default: Date.now,
    },
    // Add additional fields as needed for your game's mechanics
    // For example, towerType, healthPoints, attackPower, etc.
});

const Tower = mongoose.model('Tower', towerSchema);

module.exports = Tower;

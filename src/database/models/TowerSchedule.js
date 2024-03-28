// src/database/models/TowerSchedule.js
const mongoose = require('mongoose');

const towerScheduleSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    completionDate: { type: Date, required: true },
});

module.exports = mongoose.model('TowerSchedule', towerScheduleSchema);

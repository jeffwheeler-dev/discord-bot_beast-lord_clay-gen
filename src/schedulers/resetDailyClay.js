// src/schedulers/resetDailyClay.js
const cron = require('node-cron');
const ClayBalance = require('../database/models/ClayBalance');

const resetDailyClay = () => {
  // Schedule the reset to happen at 0:00 UTC daily
  cron.schedule('0 0 * * *', async () => {
    console.log('Resetting daily clay earned counts...');

    const result = await ClayBalance.updateMany(
      {}, 
      { $set: { dailyClayEarned: 0 } }
    );

    console.log(`Daily clay earned counts reset for ${result.nModified} channels.`);
  }, {
    scheduled: true,
    timezone: "UTC"
  });
};

module.exports = resetDailyClay;

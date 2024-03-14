const cron = require('node-cron');
const ClayBalance = require('../database/models/ClayBalance');

// Define the function
const resetClayCapacity = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Resetting daily clay earned counts...');

    const result = await ClayBalance.updateMany({}, { $set: { dailyClayEarned: 0 } });
    console.log(`Daily clay earned counts reset for ${result.nModified} entries.`);
  }, {
    scheduled: true,
    timezone: "UTC"
  });
};

// Export the function
module.exports = resetClayCapacity;

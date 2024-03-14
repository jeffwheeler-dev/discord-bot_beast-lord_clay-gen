// scheduler/dailyReset.js
const cron = require('node-cron');
const ClayBalance = require('../database/models/ClayBalance');

cron.schedule('0 0 * * *', async () => { // Runs every day at midnight UTC
    console.log('Resetting daily clay addition counters and performing daily reset tasks.');

    const balances = await ClayBalance.find({});
    balances.forEach(async (balance) => {
        balance.dailyAdded = 0; // Reset the counter for daily clay addition
        // Perform other daily reset actions here

        await balance.save();
    });

    console.log('Daily reset tasks completed.');
}, {
    scheduled: true,
    timezone: "UTC"
});

const cron = require('node-cron');
const ClayBalance = require('../database/models/ClayBalance');
const Alliance = require('../database/models/Alliance');
const { sendNotification } = require('./notifications');
const { client } = require('../bot'); // Correctly import the client instance

const CLAY_ADDED_PER_INTERVAL = 375;
const DAILY_CLAY_CAPACITY = 36000;

async function addClayToAllChannels() {
    const balances = await ClayBalance.find({});

    for (const balance of balances) {
        if (balance.dailyClayEarned >= DAILY_CLAY_CAPACITY) {
            console.log(`Daily capacity reached for channelId: ${balance.channelId}. No clay added.`);
            continue;
        }

        const allowedAddition = Math.min(CLAY_ADDED_PER_INTERVAL, DAILY_CLAY_CAPACITY - balance.dailyClayEarned);
        balance.balance += allowedAddition;
        balance.dailyClayEarned += allowedAddition;

        try {
            await balance.save();
            // Fetch the corresponding alliance to check for notification preferences
            const alliance = await Alliance.findOne({ channelId: balance.channelId });
            if (alliance && alliance.notificationsEnabled) { // Check if notifications are enabled for this alliance
                const notificationMessage = `+${allowedAddition} clay added to ${alliance.allianceName}. New balance: ${balance.balance}.`;
                console.log(notificationMessage);
                // Now passing client as a parameter to sendNotification
                sendNotification(client, balance.channelId, notificationMessage);
            } else {
                console.log(`Notifications are disabled or no alliance found for channelId: ${balance.channelId}.`);
            }
        } catch (error) {
            console.error(`Error updating clay balance for channelId: ${balance.channelId}:`, error);
        }
    }
}

// Schedule the job to run at precise quarter-hour marks
cron.schedule('0,15,30,45 * * * *', addClayToAllChannels, {
    scheduled: true,
    timezone: "UTC"
});

module.exports = addClayToAllChannels;

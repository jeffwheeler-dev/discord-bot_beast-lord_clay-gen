const cron = require('node-cron');
const ClayBalance = require('../database/models/ClayBalance');
const Alliance = require('../database/models/Alliance');
const { sendNotification } = require('./notifications');
const { client } = require('../bot'); // Ensure the client instance is imported correctly

const CLAY_ADDED_PER_INTERVAL = 375;
const DAILY_CLAY_CAPACITY = 36000;

async function addClayToAllChannels() {
    try {
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
                const alliance = await Alliance.findOne({ channelId: balance.channelId });
                if (alliance && alliance.notificationsEnabled) {
                    const notificationMessage = `+${allowedAddition} clay added to ${alliance.allianceName}. New balance: ${balance.balance}.`;
                    console.log(notificationMessage);
                    await sendNotification(client, balance.channelId, notificationMessage);
                } else {
                    console.log(`Notifications are disabled or no alliance found for channelId: ${balance.channelId}.`);
                }
            } catch (error) {
                console.error(`Error updating clay balance for channelId: ${balance.channelId}:`, error);
            }
        }
    } catch (error) {
        console.error('Error fetching ClayBalance data:', error);
    }
}

// Schedule the job to run at precise quarter-hour marks
cron.schedule('0,15,30,45 * * * *', addClayToAllChannels, {
    scheduled: true,
    timezone: "UTC"
});

module.exports = addClayToAllChannels;

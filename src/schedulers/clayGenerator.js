const cron = require('node-cron');
const ClayBalance = require('../database/models/ClayBalance');
const Alliance = require('../database/models/Alliance'); // Import the Alliance model
const { client } = require('../bot'); // Ensure correct import of your Discord client instance

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
            // Fetch the corresponding alliance name using channelId
            const alliance = await Alliance.findOne({ channelId: balance.channelId });
            if (alliance) {
                console.log(`Added ${allowedAddition} clay to ${alliance.allianceName}. New balance: ${balance.balance}`);
                const discordChannel = await client.channels.fetch(balance.channelId);
                discordChannel.send(`+${allowedAddition} clay added to ${alliance.allianceName}. New balance: ${balance.balance}`);
            } else {
                console.log(`No alliance found for channelId: ${balance.channelId}. Clay added without Discord notification.`);
            }
        } catch (error) {
            console.error(`Error updating clay balance for channelId: ${balance.channelId}`, error);
        }
    }
}

// Schedule the job to run at precise quarter-hour marks
cron.schedule('0,15,30,45 * * * *', addClayToAllChannels, {
    scheduled: true,
    timezone: "UTC"
});

module.exports = addClayToAllChannels;


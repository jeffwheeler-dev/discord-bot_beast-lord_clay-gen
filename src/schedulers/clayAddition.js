// scheduler/clayAddition.js
const cron = require('node-cron');
const ClayBalance = require('../database/models/ClayBalance');
const { client } = require('../bot'); // Ensure you are correctly importing your Discord client instance

const CLAY_ADDED_PER_INTERVAL = 375;
const DAILY_CLAY_CAPACITY = 36000;

// Function to add clay to all channels
async function addClayToAllChannels() {
    const channels = await ClayBalance.find({});

    for (const channel of channels) {
        if (channel.dailyAdded >= DAILY_CLAY_CAPACITY) {
            console.log(`Daily capacity reached for channel ${channel.channelId}.`);
            continue;
        }

        const allowedAddition = Math.min(CLAY_ADDED_PER_INTERVAL, DAILY_CLAY_CAPACITY - channel.dailyAdded);
        channel.balance += allowedAddition;
        channel.dailyAdded += allowedAddition;

        try {
            await channel.save();
            console.log(`Added ${allowedAddition} clay to channelId: ${channel.channelId}. New balance: ${channel.balance}`);
            
            // Optionally send a message to the Discord channel about the update
            const discordChannel = await client.channels.fetch(channel.channelId);
            discordChannel.send(`+${allowedAddition} clay added to clay balance. New balance: ${channel.balance}`);
        } catch (error) {
            console.error(`Error updating clay balance for channelId: ${channel.channelId}`, error);
        }
    }
}

// Schedule the job to run every 15 minutes
cron.schedule('0,15,30,45 * * * *', addClayToAllChannels, {
    scheduled: true,
    timezone: "UTC"
});

const ClayBalance = require('../database/models/ClayBalance');
const { PermissionsBitField } = require('discord.js');

const CLAY_ADDED_PER_INTERVAL = 375;
const DAILY_CLAY_LIMIT = 36000;

async function addClayAndNotify(channelId, client) {
    try {
        const notificationChannel = await client.channels.fetch(channelId);
        if (!notificationChannel) {
            console.error(`Could not fetch channel for channelId: ${channelId}.`);
            return;
        }

        let balanceDoc = await ClayBalance.findOne({ channelId: channelId });
        if (!balanceDoc) {
            console.log("No ClayBalance document found, creating a new one.");
            balanceDoc = new ClayBalance({
                channelId: channelId,
                balance: 0,
                dailyAdded: 0
            });
        }

        balanceDoc.dailyAdded = balanceDoc.dailyAdded || 0;
        const allowedAddition = Math.min(CLAY_ADDED_PER_INTERVAL, DAILY_CLAY_LIMIT - balanceDoc.dailyAdded);

        balanceDoc.balance += allowedAddition;
        balanceDoc.dailyAdded += allowedAddition;

        await balanceDoc.save();
        const messageContent = `+${allowedAddition} clay added to clay balance. New balance: ${balanceDoc.balance}`;
        await notificationChannel.send(messageContent);
    } catch (error) {
        console.error("Error in addClayAndNotify function:", error);
    }
}

module.exports = {
    name: 'testscheduler',
    description: 'Manually triggers the clay addition and notification process for testing purposes.',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
            return message.reply('You do not have permission to use this command.');
        }

        console.log("Executing testScheduler command...");
        await addClayAndNotify(message.channel.id, client);
    },
};

// src/commands/testScheduler.js
const ClayBalance = require('../database/models/ClayBalance');
const { EmbedBuilder } = require('discord.js'); // Assuming you're using Discord.js v13 or above

const CLAY_ADDED_PER_INTERVAL = 375;
const DAILY_CLAY_LIMIT = 36000;

async function addClayAndNotify(channelId, client) {
    const notificationChannel = await client.channels.fetch(channelId).catch(console.error);
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
            dailyAdded: 0 // Ensure dailyAdded is initialized to prevent NaN calculations
        });
    }

    // Ensure dailyAdded is a number and not undefined
    balanceDoc.dailyAdded = balanceDoc.dailyAdded || 0;

    // Calculate allowedAddition ensuring it does not result in NaN
    const allowedAddition = Math.min(CLAY_ADDED_PER_INTERVAL, DAILY_CLAY_LIMIT - balanceDoc.dailyAdded);

    console.log(`Allowed addition: ${allowedAddition}, Current balance: ${balanceDoc.balance}, Daily added: ${balanceDoc.dailyAdded}`);

    // Perform addition ensuring the results are valid numbers
    balanceDoc.balance += allowedAddition;
    balanceDoc.dailyAdded += allowedAddition;

    // Double-check for NaN values before saving
    if (isNaN(balanceDoc.balance) || isNaN(balanceDoc.dailyAdded)) {
        console.error("Calculation error: resulting balance or dailyAdded is NaN.");
        return;
    }

    try {
        await balanceDoc.save();
        const messageContent = `+${allowedAddition} clay added to clay balance. New balance: ${balanceDoc.balance}`;
        console.log(messageContent); // For debugging
        notificationChannel.send(messageContent).catch(console.error);
    } catch (error) {
        console.error("Error saving ClayBalance document:", error);
    }
}


module.exports = {
    name: 'testscheduler',
    description: 'Manually triggers the clay addition and notification process for testing purposes.',
    async execute(message, args, client) {
        console.log("Executing testScheduler command..."); // For debugging
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You do not have permission to use this command.');
        }

        await addClayAndNotify(message.channel.id, client);
        // The confirmation message is now handled within the addClayAndNotify function
    },
};

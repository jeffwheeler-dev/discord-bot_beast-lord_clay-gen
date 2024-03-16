// src/commands/unregister.js
const Alliance = require('../database/models/Alliance'); // Adjust the path to your Alliance model

module.exports = {
    name: 'unregister',
    description: 'Unregisters the alliance tied to this channel or the specified channel.',
    async execute(message, args) {
        // Check for permissions
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply('You do not have permission to unregister an alliance.');
        }

        // Determine the target channel: use mentioned channel or current channel
        const targetChannel = message.mentions.channels.first() || message.channel;

        try {
            // Attempt to find and delete the alliance record tied to the target channel
            const result = await Alliance.findOneAndDelete({ channelId: targetChannel.id });

            if (result) {
                message.reply(`The alliance has been successfully unregistered from ${targetChannel}.`);
            } else {
                message.reply(`No alliance is registered to ${targetChannel}.`);
            }
        } catch (error) {
            console.error('Error deleting the alliance:', error);
            message.reply('There was an error trying to unregister the alliance. Please try again later.');
        }
    },
};

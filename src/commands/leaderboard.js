const { EmbedBuilder } = require('discord.js');
const ClayBalance = require('../database/models/ClayBalance');

module.exports = {
    name: 'leaderboard',
    description: 'Displays a leaderboard of clay balances across all channels on the server.',
    async execute(message) {
        try {
            const balances = await ClayBalance.find({}).sort({ balance: -1 }).limit(10);

            if (balances.length === 0) {
                return message.channel.send('No clay balances found on this server.');
            }

            const leaderboardEmbed = new EmbedBuilder()
                .setTitle('Clay Balance Leaderboard')
                .setDescription('Top clay balances across all channels:')
                .setColor(0x00AE86);

            for (let balance of balances) {
                // Attempt to fetch each channel by its ID and log the result
                const channel = await message.guild.channels.fetch(balance.channelId).catch(console.error);
                console.log(`Fetching channel: ${balance.channelId}, Found:`, channel);

                const channelName = channel ? channel.name : 'Unknown or Inaccessible Channel';
                leaderboardEmbed.addFields({ name: `${channelName}`, value: `${balance.balance} clay`, inline: false });
            }

            message.channel.send({ embeds: [leaderboardEmbed] });
        } catch (error) {
            console.error('Failed to generate the leaderboard:', error);
            message.channel.send('An error occurred while trying to display the leaderboard.');
        }
    },
};

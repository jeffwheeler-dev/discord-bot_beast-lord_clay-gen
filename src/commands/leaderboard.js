const { EmbedBuilder } = require('discord.js');
const ClayBalance = require('../database/models/ClayBalance');
const Alliance = require('../database/models/Alliance');

module.exports = {
    name: 'leaderboard',
    description: 'Displays a leaderboard of clay balances across all alliances on the server.',
    async execute(message) {
        try {
            // Fetch all clay balances, sorted by balance in descending order
            const balances = await ClayBalance.find({}).sort({ balance: -1 }).limit(10);

            if (balances.length === 0) {
                return message.channel.send('No clay balances found on this server.');
            }

            const leaderboardEmbed = new EmbedBuilder()
                .setTitle('Clay Balance Leaderboard')
                .setDescription('Top clay balances across all alliances:')
                .setColor(0x00AE86);

            for (const balance of balances) {
                // Attempt to fetch the alliance name for each balance
                const alliance = await Alliance.findOne({ channelId: balance.channelId });
                const allianceName = alliance ? alliance.allianceName : 'Unknown Alliance';
                const channel = await message.guild.channels.fetch(balance.channelId).catch(() => null);
                const channelName = channel ? channel.name : 'Unknown or Inaccessible Channel';
                
                leaderboardEmbed.addFields({ name: `${allianceName} - ${channelName}`, value: `${balance.balance} clay`, inline: false });
            }

            message.channel.send({ embeds: [leaderboardEmbed] });
        } catch (error) {
            console.error('Failed to generate the leaderboard:', error);
            message.channel.send('An error occurred while trying to display the leaderboard.');
        }
    },
};
         
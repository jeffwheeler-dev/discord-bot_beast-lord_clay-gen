// Active towers remain at zero

const Alliance = require('../database/models/Alliance');
const ClayBalance = require('../database/models/ClayBalance');
const Tower = require('../database/models/Tower');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'allianceinfo',
    description: 'Displays information about the current channel\'s alliance.',
    async execute(message) {
        const channelId = message.channel.id;

        // Fetch alliance information
        const alliance = await Alliance.findOne({ channelId: channelId });
        if (!alliance) {
            return message.reply("This channel is not registered as an alliance.");
        }

        // Fetch clay balance for the alliance
        const clayBalance = await ClayBalance.findOne({ channelId: channelId }) || { balance: 0 }; // Default to 0 if not found

        // Fetch tower count for the alliance
        const towerCount = await Tower.countDocuments({ channelId: channelId, isActive: true });

        // Create and send an embed with alliance info
        const infoEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Alliance Information: ${alliance.allianceName}`)
            .addFields(
                { name: 'Clay Balance', value: clayBalance.balance.toString(), inline: true },
                { name: 'Active Towers', value: towerCount.toString(), inline: true }
                // Add additional fields as necessary
            )
            .setTimestamp();

        message.channel.send({ embeds: [infoEmbed] });
    },
};

// src/commands/help.js
// src/commands/help.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays detailed and organized help information in an embed.',
    execute(message) {
        const helpEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Beast Lord Clay Management Bot Help')
            .setDescription('This bot aids in managing clay for alliances in Beast Lord. Below is an overview of available commands:')
            .addFields(
                { name: '🔧 General Commands', value: '`ping`: Checks the bot\'s latency.\n`balance`: Shows the current clay balance of the alliance.\n`leaderboard`: Shows the leaderboard of alliances.\n`towerStatus`: Provides a detailed status of all towers.', inline: false },
                { name: '🛠️ Management Commands', value: '`adjustClay <amount>`: Adjusts the clay balance manually.\n`placeTower <home/away>`: Places a tower, deducting clay.\n`removeTower <towerId>`: Removes a previously placed tower.\n`register <allianceName> <initialClayAmount>`: Registers the channel as an alliance.\n`resetTowers`: Resets all tower placements.', inline: false },
                { name: '⚙️ Utility Commands', value: '`allianceInfo`: Displays information about the current alliance.\n`dailyResetTime`: Shows time until the daily clay reset.\n`setClay <amount>`: Directly sets the clay balance.\n`setModRole <roleId>`: Assigns the moderator role.\n`clayTrivia`: Starts a trivia game for clay.', inline: false },
                { name: '📅 Schedulers', value: 'Automated tasks for managing clay and towers, including daily additions of 375 clay every 15 minutes until the daily cap of 36,000 clay is reached, and resetting balances at midnight UTC.', inline: false }
            )
            .setFooter({ text: 'Use !help <command> for detailed information on a specific command.' });

        message.channel.send({ embeds: [helpEmbed] }).catch(console.error);
    },
};

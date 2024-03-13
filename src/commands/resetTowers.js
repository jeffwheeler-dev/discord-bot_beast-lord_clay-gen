const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
// Assuming you have a model or method to reset tower data
const { resetTowerData } = require('../utils/gameUtils');

module.exports = {
    name: 'resettowers',
    description: 'Resets all tower placements for the new game cycle.',
    async execute(message) {
        // Permissions check (assuming an isAdmin function is available)
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply("You don't have the necessary permissions to reset towers.");
        }

        // Confirmation embed
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Reset Towers Confirmation')
            .setDescription('Are you sure you want to reset all tower placements? This action cannot be undone.');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirmReset')
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('cancelReset')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Secondary),
            );

        const confirmationMessage = await message.channel.send({ embeds: [embed], components: [row] });

        // Collector for button interaction
        const filter = i => i.user.id === message.author.id;
        const collector = confirmationMessage.createMessageComponentCollector({ filter, time: 15000 }); // 15-second wait for interaction

        collector.on('collect', async i => {
            if (i.customId === 'confirmReset') {
                await resetTowerData(); // Reset tower data
                await i.update({ content: 'All tower placements have been reset for the new game cycle.', embeds: [], components: [] });
            } else if (i.customId === 'cancelReset') {
                await i.update({ content: 'Tower reset action has been cancelled.', embeds: [], components: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                confirmationMessage.edit({ content: 'Tower reset action has timed out.', embeds: [], components: [] });
            }
        });
    },
};

const { EmbedBuilder } = require('discord.js');
const ClayBalance = require('../database/models/ClayBalance');
const Tower = require('../database/models/Tower');

module.exports = {
    name: 'towerstatus',
    description: 'Displays all tower information for the current channel.',
    async execute(message) {
        const channelId = message.channel.id;

        // Fetch clay balance for the channel
        const clayBalanceObj = await ClayBalance.findOne({ channelId: channelId }) || { balance: 0, dailyAdded: 0 };
        const clayBalance = clayBalanceObj.balance;
        const totalClayAddedToday = clayBalanceObj.dailyAdded;

        // Fetch towers for the channel
        const towers = await Tower.find({ channelId: channelId, isActive: true });
        const totalTowers = towers.length;

        const now = new Date(); // Current time, used for countdown calculation

        // Calculate countdowns for the next home and away tower placements
        const homeCountdown = calculateNextTowerAvailability(clayBalance, totalClayAddedToday, 'home', now);
        const awayCountdown = calculateNextTowerAvailability(clayBalance, totalClayAddedToday, 'away', now);

        // Constructing the message embed
        const statusEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Tower Status')
            .addFields(
                { name: 'Total Balance', value: clayBalance.toString(), inline: true },
                { name: 'Total Towers', value: totalTowers.toString(), inline: true },
                { name: 'Next Home Tower In', value: homeCountdown, inline: true },
                { name: 'Next Away Tower In', value: awayCountdown, inline: true }
                // Include additional tower info as needed
            )
            .setTimestamp();

        message.channel.send({ embeds: [statusEmbed] });
    },
};

function calculateNextTowerAvailability(balance, totalAddedToday, type, now) {
    const HOME_TOWER_COST = 2000; // Example cost for home tower
    const AWAY_TOWER_COST = 4000; // Example cost for away tower
    const DAILY_CLAY_LIMIT = 36000;
    const CLAY_ADDITION_AMOUNT = 375;
    const CLAY_ADDITION_INTERVAL = 15; // Clay is added every 15 minutes

    const cost = type === 'home' ? HOME_TOWER_COST : AWAY_TOWER_COST;
    if (balance >= cost) return 'Available now';
    if (totalAddedToday >= DAILY_CLAY_LIMIT) return 'Not available today due to daily clay limit';

    const clayDeficit = cost - balance;
    const additionsNeeded = Math.ceil(clayDeficit / CLAY_ADDITION_AMOUNT);

    // Calculate the time until the next scheduled clay addition
    const minutesPastHour = now.getUTCMinutes();
    const minutesUntilNextAddition = (15 - (minutesPastHour % 15)) % 15;

    // Correctly calculate total minutes until the required clay is available
    const totalMinutesUntilAvailable = (additionsNeeded - 1) * CLAY_ADDITION_INTERVAL + minutesUntilNextAddition;

    return `${totalMinutesUntilAvailable} minutes until available`;
}

const ClayBalance = require('../database/models/ClayBalance');
const { hasModPermissions } = require('../utils/permissionsUtil');

module.exports = {
    name: 'placetower',
    description: 'Places a tower in the specified territory, costing clay.',
    async execute(message, args) {
        // Ensure the command includes the type of tower placement
        if (!args.length || (args[0].toLowerCase() !== 'home' && args[0].toLowerCase() !== 'away')) {
            return message.reply('Please specify where to place the tower: home or away.');
        }

        const hasPermission = await hasModPermissions(message);
        if (!hasPermission) {
            return message.reply("You don't have permission to place a tower.");
        }

        const towerType = args[0].toLowerCase();
        const cost = towerType === 'home' ? 2000 : 4000; // Example costs for home and away towers

        console.log(`Attempting to place a ${towerType} tower for channel: ${message.channel.id}`);

        let clayBalance = await ClayBalance.findOne({ channelId: message.channel.id });
        console.log('Fetched clay balance:', clayBalance);

        if (!clayBalance) {
            console.log(`No clay balance found for channel: ${message.channel.id}. Initializing with 0 clay.`);
            return message.reply("This channel doesn't have any clay to place a tower.");
        }

        if (clayBalance.balance < cost) {
            return message.reply(`Insufficient clay to place a ${towerType} tower. You need at least ${cost} clay. Current balance: ${clayBalance.balance}`);
        }

        clayBalance.balance -= cost;
        await clayBalance.save();

        console.log(`Successfully placed a ${towerType} tower for channel: ${message.channel.id}. New balance: ${clayBalance.balance}`);
        message.reply(`A ${towerType} tower has been successfully placed! New clay balance: ${clayBalance.balance}`);
    },
};

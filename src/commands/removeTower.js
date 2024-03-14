const Tower = require('../database/models/Tower');
const ClayBalance = require('../database/models/ClayBalance');
const { hasModPermissions } = require('../utils/permissionsUtil');

module.exports = {
    name: 'removetower',
    description: 'Removes a tower from a specified location.',
    async execute(message, args) {
        if (!await hasModPermissions(message)) {
            return message.reply("You don't have permission to remove a tower.");
        }

        if (args.length < 1) {
            return message.reply('Please specify the location of the tower you want to remove. Usage: `!removetower [location]`');
        }

        const location = args.join(' ');
        const tower = await Tower.findOne({ location: location, channelId: message.channel.id });

        if (!tower) {
            return message.reply(`No tower found at the location: "${location}".`);
        }

        // Assuming the cost is stored in the tower or there's a fixed cost
        const cost = tower.cost || 2000; // Default to 2000 if not specified
        const refundAmount = Math.floor(cost * 0.7);

        // Update the clay balance for the channel
        const clayBalance = await ClayBalance.findOne({ channelId: message.channel.id }) || new ClayBalance({ channelId: message.channel.id, balance: 0 });
        clayBalance.balance += refundAmount;

        // Optional: Adjust the daily maximum clay cap
        // This part of the logic would need to track adjustments to ensure it doesn't exceed original limits

        await clayBalance.save();
        await Tower.deleteOne({ _id: tower._id });

        message.reply(`Tower at "${location}" has been removed. ${refundAmount} clay has been refunded to your balance.`);
    },
};

const ClayBalance = require('../database/models/ClayBalance');
const { hasModPermissions } = require('../utils/permissionsUtil');

module.exports = {
    name: 'adjustclay',
    description: 'Adjusts the clay balance for this channel.',
    async execute(message, args) {
        // Use hasModPermissions to check if the user has the right to adjust the clay balance
        const canAdjust = await hasModPermissions(message);
        if (!canAdjust) {
            return message.reply('You do not have permission to adjust the clay balance.');
        }

        // Check for the presence of an adjustment amount argument
        if (args.length !== 1 || isNaN(parseInt(args[0], 10))) {
            return message.reply('Please specify a valid number to adjust the clay balance by.');
        }

        const adjustment = parseInt(args[0], 10);
        const channelId = message.channel.id;

        try {
            let clayBalance = await ClayBalance.findOne({ channelId: channelId });

            // If no balance exists for this channel, initialize it with the adjustment amount
            if (!clayBalance) {
                clayBalance = new ClayBalance({
                    channelId,
                    balance: adjustment
                });
            } else {
                // Adjust the existing balance
                clayBalance.balance += adjustment;
            }

            await clayBalance.save();
            message.reply(`The clay balance has been successfully adjusted by ${adjustment}. New balance: ${clayBalance.balance} clay.`);
        } catch (error) {
            console.error('Failed to adjust clay balance:', error);
            message.reply('An error occurred while trying to adjust the clay balance.');
        }
    },
};

const ClayBalance = require('../database/models/ClayBalance');
const { hasModPermissions } = require('../utils/permissionsUtil');

module.exports = {
    name: 'setclay',
    description: 'Sets the clay balance for the current channel.',
    async execute(message, args) {
        // Check if the user has Mod permissions to execute the command
        if (!await hasModPermissions(message)) {
            return message.reply("You don't have the necessary permissions to set the clay balance.");
        }

        // Ensure there is an amount provided
        if (args.length < 1 || isNaN(args[0])) {
            return message.reply('Please provide a valid number of clay to set. Usage: `!setclay [amount]`');
        }

        const amount = parseInt(args[0], 10);
        if (amount < 0) {
            return message.reply('The amount of clay must be a positive number.');
        }

        const channelId = message.channel.id;

        // Find the ClayBalance for the channel or create a new one if it doesn't exist
        let clayBalance = await ClayBalance.findOne({ channelId: channelId });
        if (!clayBalance) {
            clayBalance = new ClayBalance({
                channelId: channelId,
                balance: amount,
            });
        } else {
            clayBalance.balance = amount;
        }

        await clayBalance.save();
        message.reply(`The clay balance has been set to ${amount} for this channel.`);
    },
};

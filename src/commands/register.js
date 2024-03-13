const ClayBalance = require('../database/models/ClayBalance');
const Alliance = require('../database/models/Alliance');
const { hasAdminPermissions } = require('../utils/permissionsUtil'); // Ensure the path matches your project structure

module.exports = {
    name: 'register',
    description: 'Registers this channel as an alliance with an initial clay balance.',
    async execute(message, args) {
        // Check for admin permissions before proceeding
        if (!await hasAdminPermissions(message)) {
            return message.reply("You need admin permissions to register an alliance.");
        }

        // Ensure both an alliance name and initial clay balance are provided
        if (args.length < 2) {
            return message.reply("Usage: `!register [Alliance Name] [Initial Clay Balance]`");
        }

        const initialClayBalance = parseInt(args.pop(), 10); // Assuming the last argument is the clay balance
        if (isNaN(initialClayBalance) || initialClayBalance < 0) {
            return message.reply("The initial clay balance must be a valid, non-negative number.");
        }

        const allianceName = args.join(' '); // The remaining arguments form the alliance name

        // Prevent registration if the channel is already associated with an alliance
        const existingAlliance = await Alliance.findOne({ channelId: message.channel.id });
        if (existingAlliance) {
            return message.reply("This channel is already registered as an alliance.");
        }

        // Create a new alliance document
        const newAlliance = new Alliance({
            channelId: message.channel.id,
            allianceName,
        });
        await newAlliance.save();

        // Initialize the clay balance for the new alliance
        const newClayBalance = new ClayBalance({
            channelId: message.channel.id,
            balance: initialClayBalance,
        });
        await newClayBalance.save();

        // Confirm registration and balance initialization to the user
        message.reply(`"${allianceName}" has been registered as an alliance with an initial clay balance of ${initialClayBalance}.`);
    },
};

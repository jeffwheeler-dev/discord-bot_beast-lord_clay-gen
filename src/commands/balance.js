const ClayBalance = require('../database/models/ClayBalance');

module.exports = {
    name: 'balance',
    description: 'Checks the clay balance for the channel.',
    async execute(message, args) {
        const channelId = message.channel.id;
        let clayBalance = await ClayBalance.findOne({ channelId });

        if (!clayBalance) {
            // If no balance exists for this channel, initialize it
            clayBalance = new ClayBalance({ channelId, balance: 0 }); // Starting balance can be adjusted
            await clayBalance.save();
            message.reply("The clay balance for " + channelId + " has been initialized. Current balance: 0 clay.");
        } else {
            // If a balance exists, reply with the current balance
            message.reply(`This channel's current clay balance is ${clayBalance.balance} clay.`);
        }
    },
};

// src/commands/removeTower.js
const ClayBalance = require('../database/models/ClayBalance');
const Alliance = require('../database/models/Alliance'); // Add this line to import the Alliance model
const Tower = require('../database/models/Tower');
const { hasModPermissions } = require('../utils/permissionsUtil');

module.exports = {
    name: 'removetower',
    description: 'Removes a tower and updates the clay balance.',
    async execute(message, args) {
        if (!await hasModPermissions(message)) {
            return message.reply("You don't have permission to remove a tower.");
        }

        if (args.length < 1) {
            return message.reply('Usage: `!removetower [home/away]`. Example: `!removetower home`');
        }

        const towerType = args[0].toLowerCase();
        const refundAmount = towerType === 'home' ? 2000 : 0; // Refund 2000 for home towers, 0 for away towers

        const alliance = await Alliance.findOne({ channelId: message.channel.id });
        if (!alliance) {
            return message.reply("This channel is not registered as an alliance.");
        }

        let clayBalance = await ClayBalance.findOne({ channelId: message.channel.id });
        if (!clayBalance) {
            return message.reply("No clay balance found for this alliance.");
        }

        // Ensure we don't exceed the daily clay earned limit by adding the refund
        const potentialDailyClay = clayBalance.dailyClayEarned + refundAmount;
        if (potentialDailyClay > clayBalance.dailyMaxClay) {
            return message.reply("Refunding this tower would exceed the daily clay limit.");
        }

        // Update the clay balance and daily clay earned
        clayBalance.balance += refundAmount;
        clayBalance.dailyClayEarned += refundAmount; // Assuming we want to track refunds as part of daily earnings
        await clayBalance.save();

        // Update the tower count
        const towerUpdate = towerType === 'home' ? { $inc: { homeTowerCount: -1 } } : { $inc: { awayTowerCount: -1 } };
        await Tower.findOneAndUpdate({ allianceId: alliance._id }, towerUpdate, { new: true });

        message.reply(`A ${towerType} tower has been successfully removed by the ${alliance.allianceName} alliance. ${refundAmount} clay has been refunded to the balance. Current balance: ${clayBalance.balance} clay.`);
    },
};

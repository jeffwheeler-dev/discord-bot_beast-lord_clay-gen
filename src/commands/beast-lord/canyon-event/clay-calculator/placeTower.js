// src/commands/placetower.js
const ClayBalance = require('../database/models/ClayBalance');
const Alliance = require('../database/models/Alliance');
const Tower = require('../database/models/Tower');
const { hasModPermissions } = require('../utils/permissionsUtil')
module.exports = {
    name: 'placetower',
    description: 'Places a tower for your alliance, either at home or away, without specifying a location.',
    async execute(message, args) {
        if (args.length < 1) {
            return message.reply('Usage: `!placetower [home/away]`. Example: `!placetower home`');
        }

        if (!await hasModPermissions(message)) {
            return message.reply("You don't have permission to place a tower.");
        }

        const towerType = args[0].toLowerCase();
        const cost = towerType === 'home' ? 2000 : 4000; // Adjust costs as necessary

        const alliance = await Alliance.findOne({ channelId: message.channel.id });
        if (!alliance) {
            return message.reply("This channel is not registered as an alliance.");
        }

        let clayBalance = await ClayBalance.findOne({ channelId: message.channel.id });
        if (!clayBalance || clayBalance.balance < cost) {
            return message.reply(`Insufficient clay to place a ${towerType} tower. You need at least ${cost} clay.`);
        }

        // Deduct the clay cost and update the balance
        clayBalance.balance -= cost;
        await clayBalance.save();

        // Update the tower count
        const towerUpdate = towerType === 'home' ? { $inc: { homeTowerCount: 1 } } : { $inc: { awayTowerCount: 1 } };
        await Tower.findOneAndUpdate({ allianceId: alliance._id }, towerUpdate, { upsert: true, new: true });

        message.reply(`A ${towerType} tower has been successfully placed by the ${alliance.allianceName} alliance. Remaining balance: ${clayBalance.balance} clay.`);
    },
};

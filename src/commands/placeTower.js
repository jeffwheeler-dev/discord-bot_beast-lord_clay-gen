const ClayBalance = require('../database/models/ClayBalance');
const Alliance = require('../database/models/Alliance');
const Tower = require('../database/models/Tower');
const { hasModPermissions } = require('../utils/permissionsUtil'); // Ensure this utility function suits your setup

module.exports = {
    name: 'placetower',
    description: 'Places a tower in a specified location for your alliance, ensuring no duplicate locations.',
    async execute(message, args) {
        if (args.length < 2) {
            return message.reply('Usage: `!placetower [home/away] [location]`. Example: `!placetower home 100,100`');
        }

        if (!await hasModPermissions(message)) {
            return message.reply("You don't have permission to place a tower.");
        }

        const [towerType, ...locationParts] = args;
        const location = locationParts.join(' ');
        const cost = towerType.toLowerCase() === 'home' ? 2000 : 4000; // Adjust costs as necessary

        // Check if the location is already taken
        const existingTower = await Tower.findOne({ location: location });
        if (existingTower) {
            return message.reply(`A tower has already been placed at "${location}". Please choose a different location.`);
        }

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

        // Place the tower
        const newTower = new Tower({
            channelId: message.channel.id,
            allianceName: alliance.allianceName,
            isActive: true,
            location: location,
        });
        await newTower.save();

        message.reply(`A ${towerType} tower has been successfully placed at "${location}" by the ${alliance.allianceName} alliance. Remaining balance: ${clayBalance.balance} clay.`);
    },
};

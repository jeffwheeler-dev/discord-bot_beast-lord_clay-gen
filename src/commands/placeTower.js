// src/commands/placeTower.js
const ClayBalance = require('../database/models/ClayBalance'); // Make sure this path is correct
// Assuming hasModPermissions is correctly implemented and imported
const { hasModPermissions } = require('../utils/permissionsUtil'); 

module.exports = {
    name: 'placetower',
    description: 'Places a tower in your home or away territory, costing clay.',
    async execute(message, args) {
        // Check for correct argument
        if (args.length !== 1 || !['home', 'away'].includes(args[0].toLowerCase())) {
            return message.reply('Please specify the tower type: home or away.');
        }

        // Check permissions
        if (!(await hasModPermissions(message))) {
            return message.reply('You do not have permission to use this command.');
        }

        const towerType = args[0].toLowerCase();
        const cost = towerType === 'home' ? 2000 : 4000; // Set costs

        console.log(`Fetching balance for user: ${message.author.id}`);
        try {
            const userBalanceDoc = await ClayBalance.findOne({ userId: message.author.id.toString() });
            console.log('Balance document found:', userBalanceDoc);

            if (!userBalanceDoc || userBalanceDoc.balance < cost) {
                console.log(`Insufficient balance. Found: ${userBalanceDoc ? userBalanceDoc.balance : 'Document not found'}, Required: ${cost}`);
                return message.reply(`You do not have enough clay to place this tower. Your balance is ${userBalanceDoc ? userBalanceDoc.balance : '0'} clay.`);
            }

            // Deduct the clay cost
            userBalanceDoc.balance -= cost;
            await userBalanceDoc.save();

            // Success response
            message.reply(`Tower placed successfully in the ${towerType} territory! New balance: ${userBalanceDoc.balance} clay.`);
        } catch (error) {
            console.error('Error in placeTower command:', error);
            message.reply('An error occurred while trying to place the tower.');
        }
    },
};

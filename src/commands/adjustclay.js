// src/commands/adjustClay.js
const ClayBalance = require('../database/models/ClayBalance'); // Adjust the path as necessary
const { hasModPermissions } = require('../utils/checkPermissions'); // Ensure this utility is implemented to check permissions

module.exports = {
    name: 'adjustclay',
    description: 'Adjusts the clay balance by a specified amount. Usage: !adjustclay [amount]',
    async execute(message, args) {
        // Check if the user has the required permissions
        if (!(await hasModPermissions(message))) {
            return message.reply('You do not have permission to use this command.');
        }

        // Validate the input
        if (args.length !== 1 || isNaN(args[0])) {
            return message.reply('Please provide a valid number to adjust the clay balance by.');
        }

        const adjustAmount = parseInt(args[0], 10);

        try {
            // Retrieve the current clay balance document
            let clayBalance = await ClayBalance.findOne({});
            if (!clayBalance) {
                // If no clay balance exists, initialize it
                clayBalance = new ClayBalance({ balance: 0 });
            }

            // Adjust the clay balance
            clayBalance.balance += adjustAmount;
            await clayBalance.save();

            // Provide feedback to the user
            message.reply(`The clay balance has been adjusted by ${adjustAmount}. The new balance is ${clayBalance.balance}.`);
        } catch (error) {
            console.error('Failed to adjust clay balance:', error);
            message.reply('There was an error adjusting the clay balance.');
        }
    },
};

// src/database/utils.js
const User = require('./models/User');
const ClayBalance = require('./models/ClayBalance');
const TowerPlacement = require('./models/TowerPlacement');

/**
 * Fetches a user by their Discord ID.
 * @param {String} discordId - The Discord ID of the user.
 * @returns {Promise<Document|null>} - A promise that resolves to the User document, or null if not found.
 */
async function fetchUserByDiscordId(discordId) {
    try {
        const user = await User.findOne({ discordId: discordId });
        return user;
    } catch (err) {
        console.error('Error fetching user by Discord ID:', err);
        throw err; // Rethrowing the error to be handled by the caller
    }
}

/**
 * Updates the clay balance, creating a new record if one does not exist.
 * @param {Number} amount - The amount to set the clay balance to.
 * @returns {Promise<Document>} - A promise that resolves to the updated or newly created ClayBalance document.
 */
async function updateClayBalance(amount) {
    try {
        const balance = await ClayBalance.findOne({});
        if (balance) {
            balance.balance = amount;
            balance.lastUpdated = new Date();
            await balance.save();
            return balance;
        } else {
            const newBalance = new ClayBalance({ balance: amount });
            await newBalance.save();
            return newBalance;
        }
    } catch (err) {
        console.error('Error updating clay balance:', err);
        throw err; // Rethrowing the error to be handled by the caller
    }
}

module.exports = {
    fetchUserByDiscordId,
    updateClayBalance,
};

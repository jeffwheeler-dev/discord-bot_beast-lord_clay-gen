// src/utils/validation.js

/**
 * Validates if a given string is a valid Discord ID.
 * Discord IDs are usually 18-digit long numeric strings.
 * @param {string} id - The string to validate.
 * @return {boolean} - Returns true if valid, false otherwise.
 */
const isValidDiscordID = (id) => {
    return /^\d{18}$/.test(id);
};

/**
 * Checks if the provided role ID exists in the server.
 * @param {Guild} guild - The Discord guild (server) object.
 * @param {string} roleId - The role ID to check for.
 * @return {boolean} - Returns true if the role exists, false otherwise.
 */
const roleExistsInGuild = (guild, roleId) => {
    return guild.roles.cache.has(roleId);
};

/**
 * Validates if the provided channelId corresponds to a text channel in the guild.
 * @param {Guild} guild - The Discord guild (server) object.
 * @param {string} channelId - The channel ID to validate.
 * @return {boolean} - Returns true if the channel exists and is a text channel, false otherwise.
 */
const isValidTextChannel = (guild, channelId) => {
    const channel = guild.channels.cache.get(channelId);
    return channel && channel.isText();
};

/**
 * Validates whether the given string is a valid integer and optionally within a specific range.
 * @param {string} value - The string to validate.
 * @param {number} [min] - Optional minimum value.
 * @param {number} [max] - Optional maximum value.
 * @return {boolean} - Returns true if valid, false otherwise.
 */
const isValidInteger = (value, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) => {
    const num = Number(value);
    return Number.isInteger(num) && num >= min && num <= max;
};

module.exports = {
    isValidDiscordID,
    roleExistsInGuild,
    isValidTextChannel,
    isValidInteger,
};

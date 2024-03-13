const hasAdminPermissions = (message) => {
    // Checks if the message author has the 'ADMINISTRATOR' permission
    return message.member.permissions.has('ADMINISTRATOR');
};

const hasModPermissions = (message) => {
    // Placeholder for moderator permission checks.
    // Implement your logic here, for example:
    // return message.member.permissions.has('MANAGE_CHANNELS') || hasAdminPermissions(message);
    return message.member.roles.cache.some(role => role.name === "Moderator") || hasAdminPermissions(message);
};

module.exports = { hasAdminPermissions, hasModPermissions };

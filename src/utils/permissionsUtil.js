const { PermissionsBitField } = require('discord.js');

const hasAdminPermissions = (message) => {
  // Assuming 'message' is the Discord message object
  return message.member.permissions.has(PermissionsBitField.Flags.Administrator);
};

module.exports = { hasAdminPermissions };

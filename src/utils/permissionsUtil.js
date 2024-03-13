// src/utils/permissionsUtil.js
const Setting = require('../database/models/Setting');

const hasModPermissions = async (message) => {
    const serverSettings = await Setting.findOne({ serverID: message.guild.id });
    if (!serverSettings || !serverSettings.modRoleID) return false;
    return message.member.roles.cache.has(serverSettings.modRoleID) || message.member.permissions.has('ADMINISTRATOR');
};

module.exports = { hasModPermissions };

const Setting = require('../database/models/Setting'); // Ensure this path is correct

const hasModPermissions = async (message) => {
    try {
        const setting = await Setting.findOne({ serverID: message.guild.id });
        if (!setting || !setting.modRoleID) return false;

        return message.member.roles.cache.has(setting.modRoleID);
    } catch (error) {
        console.error('Error checking mod permissions:', error);
        return false;
    }
};

module.exports = { hasModPermissions };

// src/commands/setModRole.js
const { Permissions } = require('discord.js');
const Setting = require('../database/models/Setting'); // Adjust the path as necessary

module.exports = {
    name: 'setmodrole',
    description: 'Sets the moderator role for admin commands.',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You need administrator permissions to set the moderator role.');
        }
        
        

        const roleMention = message.mentions.roles.first();
        if (!roleMention) {
            return message.reply('Please mention a valid role to set as the moderator role.');
        }

        try {
            const serverID = message.guild.id;
            const modRoleID = roleMention.id;

            // Update or create the setting
            const setting = await Setting.findOneAndUpdate(
                { serverID: serverID },
                { $set: { modRoleID: modRoleID } },
                { new: true, upsert: true }
            );

            message.reply(`The moderator role has been set to ${roleMention.name}.`);
        } catch (error) {
            console.error('Failed to set moderator role:', error);
            message.reply('There was an error setting the moderator role.');
        }
    },
};

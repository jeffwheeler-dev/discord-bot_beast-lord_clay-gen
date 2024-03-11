// src/utils/embedsUtil.js
const { MessageEmbed } = require('discord.js');

const createEmbed = (title, description, fields = []) => {
    return new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .addFields(fields)
        .setTimestamp();
};

module.exports = { createEmbed };

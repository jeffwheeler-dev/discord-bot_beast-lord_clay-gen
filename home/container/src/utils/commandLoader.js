// src/utils/commandLoader.js
const fs = require('fs');

const loadCommands = (client, path) => {
    const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`${path}/${file}`);
        client.commands.set(command.name, command);
    }
};

module.exports = { loadCommands };

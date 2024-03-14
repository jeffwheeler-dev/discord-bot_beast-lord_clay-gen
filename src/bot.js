require('dotenv').config();
require('./database'); // Ensures database connection
const fs = require('fs');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const Server = require('./database/models/Server'); // Adjust the path as needed
const resetDailyClay = require('./schedulers/resetDailyClay'); // Import the scheduler
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    // Adjust the path if your command files are in a different location
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
    resetDailyClay(); // Initialize the scheduler for daily clay reset
});

client.on('messageCreate', message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

// Your existing guildCreate listener remains unchanged

client.login(process.env.DISCORD_TOKEN);

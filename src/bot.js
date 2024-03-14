require('dotenv').config();
require('./database');
const fs = require('fs');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const Server = require('./models/Server'); // Adjust the path to your Server model
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
    const command = require(`./commands/${file}`); // Ensure this path is correctly pointing to your commands folder
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
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

// Listen for when the bot joins a new guild
client.on('guildCreate', async guild => {
    try {
        await Server.create({
            serverId: guild.id,
            serverName: guild.name,
            // Additional fields can be added here based on your Server schema
        });
        console.log(`Joined and saved new server: ${guild.name}`);
    } catch (error) {
        console.error('Error saving new server info:', error);
    }
});

client.login(process.env.DISCORD_TOKEN);

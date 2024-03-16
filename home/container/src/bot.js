require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const Server = require('./database/models/Server');
// No need to require clayGenerator.js here if it's scheduled within itself

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

async function startBot() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully.');

        for (const guild of client.guilds.cache.values()) {
            try {
                const existingServer = await Server.findOne({ serverId: guild.id });
                if (!existingServer) {
                    console.log(`Server not found in DB, adding: ${guild.name}`);
                    await Server.create({
                        serverId: guild.id,
                        serverName: guild.name
                    });
                    console.log(`New server added: ${guild.name}`);
                } else {
                    console.log(`Server already registered: ${guild.name}`);
                }
            } catch (error) {
                console.error(`Error checking/adding server ${guild.name} (ID: ${guild.id}):`, error);
            }
        }
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

client.once('ready', () => {
    console.log('Bot is ready!');
    startBot();
    // No need to call addClayToAllChannels here as it should be scheduled in the clayGenerator.js
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

client.on('guildCreate', async guild => {
    try {
        console.log(`Bot joined a new server: ${guild.name}`);
        await Server.create({
            serverId: guild.id,
            serverName: guild.name
        });
        console.log(`Joined and saved new server: ${guild.name}`);
    } catch (error) {
        console.error(`Error saving new server ${guild.name}:`, error);
    }
});

client.login(process.env.DISCORD_TOKEN);

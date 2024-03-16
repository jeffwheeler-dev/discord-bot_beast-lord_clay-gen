require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const Server = require('./database/models/Server');

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
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully.');

        // Perform server checks or other startup operations here
        for (const guild of client.guilds.cache.values()) {
            try {
                console.log(`Checking server: ${guild.name} (ID: ${guild.id})`);
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
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        await command.execute(message, args);
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

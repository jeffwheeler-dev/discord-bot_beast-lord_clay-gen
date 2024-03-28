require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const Server = require('./src/database/models/Server'); // Adjusted the path

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.commands = new Collection();
const commandFilesPath = `${__dirname}/src/commands`; // Correct path to commands directory
const commandFiles = fs.readdirSync(commandFilesPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`${commandFilesPath}/${file}`); // Corrected require path
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
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (commandName === 'schedule') {
        // Check if a tower is already scheduled
        if (isTowerScheduled) {
            message.channel.send("A tower is already scheduled for construction. Please wait for the current tower to be completed.");
            return;
        }

        // Logic to schedule tower construction
        // This is just an example and should be modified based on your implementation
        try {
            // Your logic to calculate estimated completion date and schedule tower construction
            // For demonstration purposes, we'll set a timeout to simulate tower construction
            isTowerScheduled = true;
            message.channel.send("Tower construction scheduled successfully. Estimated completion date: Mon Mar 25 2024 20:00:00 GMT-0400 (Eastern Daylight Time)");
            setTimeout(() => {
                isTowerScheduled = false; // Reset the flag after tower construction is completed
                message.channel.send("Tower construction completed.");
            }, 60000); // Simulate 1 minute construction time (adjust as needed)
        } catch (error) {
            console.error("Error scheduling tower construction:", error);
            message.channel.send("Error scheduling tower construction. Please try again later.");
        }
    } else {
        const command = client.commands.get(commandName);
        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }
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

// Flag to track if a tower is already scheduled
let isTowerScheduled = false;

// Replace DISCORD_TOKEN with your actual Discord bot token
client.login(process.env.DISCORD_TOKEN);

// Import required packages and modules
require('dotenv').config();
require('./database'); // Ensures database connection
const fs = require('fs');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

// Import schedulers
const generateClay = require('./schedulers/clayGenerator');
const resetDailyClayCapacity = require('./schedulers/resetClayCapacity');

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Prepare command handling
client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Event: Bot ready
client.once('ready', () => {
    console.log('Bot is ready!');

    // Start schedulers
    generateClay();
    resetDailyClayCapacity();

    // Additional startup logic can be added here
});

// Event: Message creation
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

// Log in to Discord with your app's token
client.login(process.env.DISCORD_TOKEN);

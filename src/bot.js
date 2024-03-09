require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Create a new client instance with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

// Listening to messages
client.on('messageCreate', message => {
    console.log(`Message received: ${message.content}`); // Log every message received for debugging

    if (message.content === '!ping') {
        console.log('Ping command detected'); // Confirm command detection
        message.reply('Pong!'); // Respond to the command
    }
});

// Login to Discord with your app's token
client.login(process.env.DISCORD_TOKEN);

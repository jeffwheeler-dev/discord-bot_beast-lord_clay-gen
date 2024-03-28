const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'dailyresettime',
    description: 'Shows the time remaining until the daily reset.',
    execute(message, args) {
        // Define the reset time (24-hour format in UTC)
        const resetHour = 0; // Midnight UTC

        // Get the current time in UTC
        const now = new Date();
        const utcNow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

        // Calculate the next reset time
        let nextReset = new Date(utcNow);
        nextReset.setUTCHours(resetHour, 0, 0, 0); // Set to the next reset hour (0:00 UTC)

        // If we've already passed today's reset time, set the next reset to tomorrow
        if (now.getUTCHours() >= resetHour) {
            nextReset.setUTCDate(nextReset.getUTCDate() + 1);
        }

        // Calculate the difference in milliseconds
        const diff = nextReset - now;

        // Convert milliseconds to hours and minutes
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        // Create a message embed with the time remaining
        const embed = new EmbedBuilder()
            .setTitle('Daily Reset Time')
            .setDescription(`Time remaining until the next daily reset: **${hours} hours and ${minutes} minutes**`)
            .setColor('#0099ff'); // You can customize the color

        // Send the embed to the channel
        message.channel.send({ embeds: [embed] });
    },
};

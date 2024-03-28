// src/commands/register.js
const { MessageMentionOptions } = require('discord.js');
const Alliance = require('../database/models/Alliance');
const ClayBalance = require('../database/models/ClayBalance');

module.exports = {
    name: 'register',
    description: 'Register an alliance with initial details.',
    async execute(message) {
        const askQuestion = async (question) => {
            await message.channel.send(question);
            const filter = m => m.author.id === message.author.id;
            const collected = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
            return collected.first().content;
        };

        try {
            const allianceName = await askQuestion("What is the name of the alliance?");
            const channelResponse = await askQuestion("What channel would you like to bind this alliance to? Mention the channel.");
            // Parse channel from response
            const channelMatch = channelResponse.match(/<#(\d+)>/);
            const channelId = channelMatch ? channelMatch[1] : null;
            const channel = channelId ? await message.guild.channels.cache.get(channelId) : null;
            if (!channel) return message.reply("You did not mention a valid channel.");

            const clayAmount = await askQuestion("How much clay does the alliance currently have?");
            const homeTowers = await askQuestion("How many towers has the alliance placed on their home territory?");
            const awayTowers = await askQuestion("How many towers has the alliance placed outside of the home territory? (Includes clash zones, tree zone, and other alliance's zones)");

            // Create or update the alliance in your database
            await Alliance.findOneAndUpdate(
                { channelId: channel.id },
                { allianceName, channelId: channel.id },
                { new: true, upsert: true }
            );

            await ClayBalance.findOneAndUpdate(
                { channelId: channel.id },
                { balance: parseInt(clayAmount), homeTowers: parseInt(homeTowers), awayTowers: parseInt(awayTowers) },
                { new: true, upsert: true }
            );

            // After successful registration, automatically execute the allianceinfo command
            const allianceInfoCommand = message.client.commands.get('allianceinfo');
            if (allianceInfoCommand) {
                // Create a mock message object for executing the allianceinfo command in the bound channel
                const mockMessage = { ...message, channel: channel };
                await allianceInfoCommand.execute(mockMessage, []);
            } else {
                message.reply('Failed to find the allianceinfo command.');
            }
            
            message.reply(`${allianceName} has been successfully created and bound to ${channel}.`);
        } catch (error) {
            console.error('An error occurred:', error);
            message.reply('An error has occured.');
        }
    }
};

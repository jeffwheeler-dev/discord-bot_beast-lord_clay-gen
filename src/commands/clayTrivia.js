const { MessageCollector } = require('discord.js');
const ClayBalance = require('../database/models/ClayBalance');
const { hasModPermissions } = require('../utils/permissionsUtil');

// Sample trivia questions
const triviaQuestions = [
    { question: "What is the capital of France?", answer: "paris" },
    { question: "What is 2 + 2?", answer: "4" },
    // Add more questions as needed
];

module.exports = {
    name: 'claytrivia',
    description: 'Start a trivia question. Answer correctly to earn clay!',
    async execute(message, args) {
        if (!await hasModPermissions(message)) {
            return message.reply("You don't have permission to start a trivia game.");
        }

        // Randomly select a question
        const selectedQuestion = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];

        // Ask the question
        message.channel.send(selectedQuestion.question);

        // Create a message collector to listen for answers
        const collector = new MessageCollector(message.channel, m => m.author.id !== message.client.user.id, { time: 15000 }); // 15 seconds to answer

        collector.on('collect', async (msg) => {
            if (msg.content.toLowerCase() === selectedQuestion.answer.toLowerCase()) {
                // Correct answer, stop collecting
                collector.stop('answered');

                const channelId = message.channel.id;
                let clayBalance = await ClayBalance.findOne({ channelId });

                if (!clayBalance) {
                    // Initialize balance for the channel if not existent
                    clayBalance = new ClayBalance({ channelId, balance: 100 }); // Reward for correct answer, adjust as needed
                    await clayBalance.save();
                } else {
                    // Update balance for the channel
                    clayBalance.balance += 100; // Reward for correct answer, adjust as needed
                    await clayBalance.save();
                }

                message.channel.send(`${msg.author} got the answer right! +100 clay to the channel's balance.`);
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason !== 'answered') {
                message.channel.send('Looks like nobody got the answer this time.');
            }
        });
    },
};

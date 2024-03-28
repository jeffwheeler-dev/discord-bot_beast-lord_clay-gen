module.exports = {
    name: 'ping',
    description: 'Ping! This command shows the bot\'s current latency.',
    execute(message, args) {
        const sent = Date.now();
        message.channel.send('Pong!').then(sentMessage => {
            const received = Date.now();
            const latency = received - sent;
            sentMessage.edit(`Pong! Latency is ${latency}ms.`);
        });
    },
};

const TowerSchedule = require('../database/models/TowerSchedule'); // Adjust the path as needed

module.exports = {
    name: 'schedule',
    description: 'Schedule tower placement.',
    async execute(message, args) {
        if (!args.length) {
            // Check if there are towers scheduled for this alliance in the TowerSchedule database
            const allianceTowers = await TowerSchedule.find({ alliance: 'YourAllianceName', scheduled: true });
            if (allianceTowers.length === 0) {
                // No towers scheduled, prompt user to specify tower type
                message.channel.send('No towers scheduled for your alliance. Use `!schedule home` or `!schedule away` to schedule towers.');
                return;
            } else {
                // Towers scheduled, list them with their creation time
                let towerList = 'Scheduled towers:\n';
                allianceTowers.forEach(tower => {
                    towerList += `${tower.type} Tower - Created at ${tower.createdAt.toUTCString()}\n`;
                });
                message.channel.send(towerList);
                return;
            }
        }

        // Validate tower type
        const towerType = args[0].toLowerCase();
        if (towerType !== 'home' && towerType !== 'away') {
            message.channel.send('Invalid tower type. Use `!schedule home` or `!schedule away`.');
            return;
        }

        // Calculate tower placement time based on clay income and existing towers
        const currentTime = new Date();
        let estimatedCompletionDate;

        // Your logic to calculate estimatedCompletionDate based on clay income and existing towers
        // Replace the following line with your actual calculation
        estimatedCompletionDate = new Date(currentTime.getTime() + (2 * 24 * 60 * 60 * 1000)); // Example: 2 days from now

        // Save the scheduled tower in the database
        await TowerSchedule.create({
            alliance: 'YourAllianceName',
            type: towerType,
            scheduled: true,
            createdAt: currentTime,
            estimatedCompletionDate: estimatedCompletionDate
        });

        // Inform the user about the scheduled tower and estimated completion date
        message.channel.send(`Tower construction scheduled successfully. Estimated completion date: ${estimatedCompletionDate.toUTCString()}`);
    },
};

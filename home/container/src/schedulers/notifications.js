// notifications.js (Ensure this file exists and is correctly implemented)
const { client } = require('../bot'); // Make sure this is the correct path to your Discord client instance

async function sendNotification(client, channelId, message) {
  try {
    const channel = await client.channels.fetch(channelId);
    await channel.send(message);
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}


module.exports = { sendNotification };

// src/utils/errorHandler.js
const handleError = (error, message) => {
    console.error(error);
    message.reply('An error occurred while executing the command. Please try again later.');
};

module.exports = { handleError };

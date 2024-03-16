# Beast Lord Clay Calculator Bot

## Overview
The Beast Lord Clay Calculator Bot is a Discord bot designed to help alliances in the game Beast Lord manage their clay resources more effectively. It tracks clay generation in real time, assists in planning tower placements during Canyon events, and provides a log of all actions for leadership review.

## Features
- **Real-Time Clay Tracking**: Automatically updates clay balance every 15 minutes, in line with game mechanics.
- **Tower Placement Commands**: Leaders can use commands like `!tower home` and `!tower away` to spend clay and place towers in their territory or in enemy territories, respectively.
- **Daily Reports and Notifications**: Sends daily summaries of clay usage and notifies when the clay balance reaches its daily capacity.
- **Error Handling**: Provides feedback on command errors and ensures robust operation through detailed logging.

## Prerequisites
Before setting up the bot, ensure you have the following:
- Node.js (v14.0.0 or newer)
- npm (v6.0.0 or newer)
- A Discord account and a server where you have permissions to add bots
- A MongoDB database for data persistence

## Setup
1. **Clone the Repository**: Clone this repository to your local machine using `git clone <repository-url>`.
2. **Install Dependencies**: Navigate to the project directory and run `npm install` to install the required dependencies.
3. **Configure Environment Variables**: Rename `.env.example` to `.env` and fill in your Discord bot token and MongoDB URI.
4. **Invite the Bot to Your Server**: Follow the Discord Developer Portal instructions to add the bot to your server.
5. **Start the Bot**: Run `node src/bot.js` to start the bot.

## Usage
- **Check Clay Balance**: `!clay balance` - Displays the current clay balance.
- **Place a Tower**: 
  - `!tower home` - Spends 2000 clay to place a tower in your territory.
  - `!tower away` - Spends 4000 clay to place a tower in an enemy territory.

## Commands
- `!clay balance` - Shows the current clay balance.
- `!tower [home/away]` - Places a tower, spending clay accordingly.
- Additional commands...

## Contributing
Contributions to the Beast Lord Clay Calculator Bot are welcome! Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests to us.

## License
This project is licensed under the MIT License - see the `LICENSE.md` file for details.

## Acknowledgments
- Game developers and community of Beast Lord.
- Contributors and friends who supported this project.

## Contact
For support or any questions, feel free to contact me at [your-email@example.com].


// Require the necessary discord.js classes
const { Client } = require('discord.js');
require("dotenv").config()

// Create a new client instance
const client = new Client({ intents: 32767/*[Intents.FLAGS.GUILDS]*/ });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Bot login successful');
});

// Login to Discord with your client's token
client.login();

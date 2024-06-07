require('dotenv').config();
require('../server');
const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder'); // Include Movements for pathfinder
const setupAutoEat = require('./eat');
const itemTakerModule = require('./itemTaker');
const coordsModule = require('./coords');
const deliveryModule = require('./delivery');
const discordModule = require('./discord/discord');
const discordModule2 = require('./discord/!kit');
const kitListModule = require('./kitlist');
const orderModule = require('./discord/order');
const savekitModule = require('./discord/savekit');
// Initialize Mineflayer bot
const bot = mineflayer.createBot({
    host: process.env.IP,
    port: parseInt(process.env.PORT), // Ensure port is parsed as an integer
    username: process.env.BOTNAME,
    version: process.env.VERSION
});

// Initialize Mineflayer Pathfinder
bot.loadPlugin(pathfinder);

// Initialize other modules
setupAutoEat(bot);
itemTakerModule(bot);
coordsModule(bot);
deliveryModule(bot);
discordModule(bot, process.env.TOKEN, process.env.GUILD_ID); // Pass Discord token and guild ID to deliveryModule
discordModule2(bot, process.env.TOKEN2, process.env.GUILD_ID); // Pass Discord token and guild ID to deliveryModule


orderModule(bot, process.env.TOKEN2, process.env.GUILD_ID); // Pass Discord 
savekitModule(bot, process.env.TOKEN2, process.env.GUILD_ID); // Pass Discord 
// Load the kits data when bot spawns

// Load the kits data when bot spawns
bot.on('spawn', () => {
    kitListModule.loadKitsData();

    // Move forward for 10 seconds
    bot.setControlState('forward', true);
    setTimeout(() => {
        bot.setControlState('forward', false);
    }, 10000); // 10 seconds
});


// Load the kits data and start anti-AFK when bot spawns
bot.on('spawn', () => {
    kitListModule.loadKitsData();
    console.log(`${process.env.BOTNAME} spawned.`);
    bot.chat(`/login ${process.env.PASSWORD}`);
});

// Event handler for chat messages
bot.on('whisper', (username, message) => {
    if (message.startsWith('!w')) {
        // Extract the text following "!w"
        const whisperMessage = message.substring(3).trim();
        // Send the extracted text back to the chat
        bot.chat(whisperMessage);
    }
});

// Event handler for errors
bot.on('error', (err) => {
    console.error('Bot error:', err);
});

// Event handler for bot spawn
bot.on('spawn', () => {
    console.log(`${process.env.BOTNAME} spawned.`);
    bot.chat(`/login ${process.env.PASSWORD}`);
});

// Event handler for chat messages
  bot.on('whisper', (username, message) =>{
    if (message.startsWith('!w')) {
        // Extract the text following "!w"
        const whisperMessage = message.substring(3).trim();
        // Send the extracted text back to the chat
        bot.chat(whisperMessage);
    }
});

// Event handler for errors
bot.on('error', (err) => {
    console.error('Bot error:', err);
});


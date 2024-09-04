require('dotenv').config();
const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');
const WebSocket = require('ws');
const http = require('http');
const kitListModule = require('./kitlist');



// Create the HTTP server
const server = http.createServer();
const wss = new WebSocket.Server({ server });

const botEvents = new (require('events'))();

// Initialize Mineflayer bot
const bot = mineflayer.createBot({
    host: process.env.IP,
    port: parseInt(process.env.PORT, 10), // Ensure port is parsed as an integer
    username: process.env.BOTNAME,
    version: process.env.VERSION
});

// Initialize Mineflayer Pathfinder
bot.loadPlugin(pathfinder);

// Initialize other modules


// Consolidated event handlers
bot.on('spawn', () => {
    console.log(`${process.env.BOTNAME} spawned.`);
    bot.chat(`/login ${process.env.PASSWORD}`);
   kitListModule.loadKitsData();

    // Move forward for 10 seconds
    bot.setControlState('forward', true);
    setTimeout(() => {
        bot.setControlState('forward', false);
    }, 10000); // 10 seconds
});

bot.on('whisper', (username, message) => {
    if (message.startsWith('!w')) {
        const whisperMessage = message.substring(3).trim();
        bot.chat(whisperMessage);
    }
});

bot.on('error', (err) => {
    console.error('Bot error:', err);
});







// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('WebSocket client connected.');

    // Handle incoming messages from WebSocket clients
    ws.on('message', (message) => {
        let messageText;
        try {
            // Ensure the message is parsed and a string
            const parsedMessage = JSON.parse(message);
            messageText = typeof parsedMessage === 'string' ? parsedMessage : JSON.stringify(parsedMessage);
        } catch (e) {
            messageText = message.toString();
        }

        // Send the message to the Minecraft server
        if (typeof messageText === 'string') {
            bot.chat(messageText);
        } else {
            console.log('Invalid message type:', typeof messageText);
        }
    });

    // Only one set of listeners for chat events, avoid duplicate
    const chatListener = (username, message) => {
        ws.send(JSON.stringify({ username, message }));
    };
    bot.on('chat', chatListener);

    // Remove the chat listener when WebSocket is closed to prevent memory leaks
    ws.on('close', () => {
        bot.removeListener('chat', chatListener);
        console.log('WebSocket client disconnected.');
    });
});

// Start the server
const PORT = process.env.WS_PORT;
server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});







// Export the bot instance
module.exports = bot;

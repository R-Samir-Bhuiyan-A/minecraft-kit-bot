// coords.js module
module.exports = (bot) => {
    bot.on('whisper', (username, message) => {
        const args = message.split(' ');
        const command = args.shift().toLowerCase();

        if (command === 'coords') {
            const position = bot.entity.position; // Get the bot's current position
            let world = '';

            // Check if the bot is in the Overworld or the Nether
            if (bot.game.dimension === 'overworld') {
                world = 'Overworld';
            } else if (bot.game.dimension === 'nether') {
                world = 'Nether';
            } else {
                world = 'nether';
            }

            // Format the coordinates
            const coordsMessage = `${world}: X=${position.x.toFixed(1)}, Y=${position.y.toFixed(1)}, Z=${position.z.toFixed(1)}`;

            // Send coordinates to the user
            bot.chat(`/w ${username}  ${coordsMessage}`);
        }
    });
};

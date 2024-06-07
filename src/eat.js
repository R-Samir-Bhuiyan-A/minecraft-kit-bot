// eat.js
const mineflayer = require('mineflayer');
const autoeat = require('mineflayer-auto-eat').plugin;

function setupAutoEat(bot) {
    bot.loadPlugin(autoeat);

    bot.on('autoeat_started', (item, offhand) => {
        console.log(`Eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`);
    });

    bot.on('autoeat_finished', (item, offhand) => {
        console.log(`Finished eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`);
    });

    bot.on('autoeat_error', console.error);
}

module.exports = setupAutoEat;

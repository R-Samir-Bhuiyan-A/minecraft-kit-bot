const fs = require('fs');

let kitsData = {}; // Store kits data from chestData.json
let lastListTime = 0; // Track last time the list was shown

// Function to load and return kits data
const loadKitsData = () => {
    try {
        kitsData = JSON.parse(fs.readFileSync('./chestData.json', 'utf8'));
        console.log('Kits data loaded successfully.');
    } catch (err) {
        console.error('Error loading kits data:', err);
    }
};

// Function to format kits list
const formatKitsList = () => {
    return Object.keys(kitsData).map((key, index) => `${index + 1}. ${key}`).join('\n');
};

// Function to handle kit list command
const handleKitList = (bot, username, message) => {
    const currentTime = Date.now();
    const args = message.split(' ');
    if (args[0] === 'list' && currentTime - lastListTime >= 30000) {
        lastListTime = currentTime;
        const kitsList = formatKitsList();
        if (kitsList) {
            bot.chat(`Available kits:\n${kitsList}`);
        } else {
            bot.chat('No kits available.');
        }
    }
};

module.exports = {
    loadKitsData,
    handleKitList,
};

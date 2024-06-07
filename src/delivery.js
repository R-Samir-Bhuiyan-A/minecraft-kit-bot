const fs = require('fs');
const { Vec3 } = require('vec3');
const { goals } = require('mineflayer-pathfinder');

module.exports = (bot) => {
    let chestsData = {}; // Store chest data
    let currentReceiver = ''; // Store current receiver

    // Function to load chest data from JSON file
    const loadChestData = () => {
        try {
            const data = fs.readFileSync('chestData.json');
            chestsData = JSON.parse(data);
            console.log('Chest data loaded (delivery)');
        } catch (err) {
            console.error('Error loading delivery chest data:', err);
        }
    };

    // Load chest data on module initialization
    loadChestData();

    // Function to save chest data to JSON file
    const saveChestData = () => {
        try {
            fs.writeFileSync('chestData.json', JSON.stringify(chestsData, null, 4));
            console.log('Chest data saved successfully.');
        } catch (err) {
            console.error('Error saving chest data:', err);
        }
    };

    bot.on('whisper', (username, message) => {
        const args = message.split(' ');
        const command = args.shift().toLowerCase();
        if (command === 'kit') {
            const chestName = args[0];
            const amount = parseInt(args[1]);
            currentReceiver = args[2]; // Store receiver

            if (!isNaN(amount) && amount > 0) {
                bot.deliverItem(chestName, amount); // No need to pass receiver here
            } else {
                bot.chat(`/w ${username} Invalid amount. Please specify a valid amount.`);
            }
        }
    });

    bot.deliverItem = (chestName, amount) => {
        const chestData = chestsData[chestName];
        if (chestData && chestData.x && chestData.y && chestData.z && chestData.item) {
            const chestPos = new Vec3(chestData.x, chestData.y, chestData.z);
            bot.pathfinder.setGoal(new goals.GoalNear(chestPos.x, chestPos.y, chestPos.z, 1));

            bot.once('goal_reached', async () => {
                const chestBlock = bot.blockAt(chestPos);
                const chest = await bot.openContainer(chestBlock);

                const item = chestData.item;

                await chest.withdraw(bot.registry.itemsByName[item].id, null, amount);
                chest.close();

                await bot.chat(`/tpa ${currentReceiver} `);

                const deliveryMessage = `Accept tpa to collect kit`;
                bot.chat(`/w ${currentReceiver} ${deliveryMessage}`);

                bot.pathfinder.setGoal(null);
            });
        } else {
            bot.chat(`/w ${currentReceiver} Chest "${chestName}" data not found or incomplete.`);
        }
    };

    bot.on('death', () => {
        bot.chat(`kit delivered and went home.`);
        // Add respawn logic if needed
    });
};

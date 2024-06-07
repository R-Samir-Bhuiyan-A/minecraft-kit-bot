 const fs = require('fs');
const { Vec3 } = require('vec3');
const { goals } = require('mineflayer-pathfinder');

module.exports = (bot) => {
    let chestsData = {}; // Store chest data

    // Function to load chest data from JSON file
    const loadChestData = () => {
        try {
            const data = fs.readFileSync('chestData.json');
            chestsData = JSON.parse(data);
            console.log('Chest data loaded (transfer)');
        } catch (err) {
            console.error('Error loading chest data:', err);
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
        if (command === 'setkit') {
            const chestName = args[0];
            const x = parseFloat(args[1]);
            const y = parseFloat(args[2]);
            const z = parseFloat(args[3]);
            const item = args.slice(4).join(' ');

            if (!isNaN(x) && !isNaN(y) && !isNaN(z) && item) {
                chestsData[chestName] = { x, y, z, item };
                saveChestData();
                bot.chat(`/w ${username} Chest "${chestName}" data saved.`);
            } else {
                bot.chat(`/w ${username} Invalid command format. Usage: setkit (name) x y z (item)`);
            }
        } else if (command === 'order') {
            const chestName = args[0];
            const amount = parseInt(args[1]);

            if (!isNaN(amount) && amount > 0) {
                bot.takeItemFromChest(chestName, amount, username);
            } else {
                bot.chat(`/w ${username} Invalid amount. Please specify a valid amount.`);
            }
        }
    });

    bot.takeItemFromChest = (chestName, amount, player) => {
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

                bot.chat(`/w ${player} Took ${amount} ${item} from "${chestName}" chest.`);
                bot.chat(`/tpa ${player}`);
                bot.pathfinder.setGoal(null);
            });
        } else {
            bot.chat(`/w ${player} Chest "${chestName}" data not found or incomplete.`);
        }
    };
};
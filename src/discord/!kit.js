const fs = require('fs');
const { Vec3 } = require('vec3');
const { goals } = require('mineflayer-pathfinder');
const { Client, IntentsBitField } = require('discord.js');

module.exports = (bot, discordToken, guildId) => {
    let chestsData = {}; // Store chest data
    let currentReceiver = ''; // Store current receiver

    // Function to load chest data from JSON file
    const loadChestData = () => {
        try {
            const data = fs.readFileSync('chestData.json');
            chestsData = JSON.parse(data);
            console.log('Chest data loaded (!kit)');
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

    // Initialize Discord bot
    const discordClient = new Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent
        ],
    });

    discordClient.once('ready', () => {
        console.log('Discord bot is ready! (!kit)');
    });

    discordClient.on('messageCreate', async message => {
        // Check if the message starts with the command prefix
        if (message.content.startsWith('!kit')) {
            // Extract the arguments from the message
            const args = message.content.slice(4).trim().split(' ');
            const chestName = args[0];
            const amount = parseInt(args[1]);
            currentReceiver = args[2];

            // Validate amount
            if (!isNaN(amount) && amount > 0) {
                message.reply(`Processing your request for ${amount} of ${chestName}... accept TPA from ${process.env.BOTNAME}`);
                bot.deliverItem(chestName, amount);
            } else {
                message.reply('Invalid amount. Please specify a valid amount.');
            }
        } else if (message.content.startsWith('!savekit')) {
            const args = message.content.split(' '); // Define args here
            const chestName = args[1];
            const x = parseFloat(args[2]);
            const y = parseFloat(args[3]);
            const z = parseFloat(args[4]);
            const item = args.slice(5).join(' ');

            if (!isNaN(x) && !isNaN(y) && !isNaN(z) && item) {
                chestsData[chestName] = { x, y, z, item };
                saveChestData();
                message.reply(`Chest "${chestName}" data saved.`);
            } else {
                message.reply(`Could not save.`);
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

                await bot.chat(`/tpa ${currentReceiver}`);

                const deliveryMessage = `Accept tpa to collect kit`;
                bot.chat(`/w ${currentReceiver} ${deliveryMessage}`);

                bot.pathfinder.setGoal(null);
            });
        } else {
            bot.chat(`/w ${currentReceiver} Chest "${chestName}" data not found or incomplete.`);
        }
    };

    bot.on('death', () => {
        bot.chat('Kit delivered and went home.');
        // Add respawn logic if needed
    });

    // Log in to Discord
    discordClient.login(discordToken);
};

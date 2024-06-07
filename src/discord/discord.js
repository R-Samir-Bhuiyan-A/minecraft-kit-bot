const fs = require('fs');
const { Vec3 } = require('vec3');
const { goals } = require('mineflayer-pathfinder');
const { Client, Intents, IntentsBitField } = require('discord.js');

module.exports = (bot, discordToken, guildId) => {
    let chestsData = {}; // Store chest data
    let currentReceiver = ''; // Store current receiver

    // Function to load chest data from JSON file
    const loadChestData = () => {
        try {
            const data = fs.readFileSync('chestData.json');
            chestsData = JSON.parse(data);
            console.log('Chest data loded (/kit)');
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
            console.log('');
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
        console.log('Discord bot is ready! (/kit)');
    });

    discordClient.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const { commandName, options } = interaction;

        if (commandName === 'kit') {
            const chestName = options.getString('kitname');
            const amount = options.getInteger('amount');
            currentReceiver = options.getString('username');

            if (!isNaN(amount) && amount > 0) {
                await interaction.reply(`Processing your request for ${amount} of ${chestName}... accept TPA from ${process.env.BOTNAME}`);
                bot.deliverItem(chestName, amount);
            } else {
                await interaction.reply('Invalid amount. Please specify a valid amount.');
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
        bot.chat('kit delivered and went home.');
        // Add respawn logic if needed
    });

    // Log in to Discord
    discordClient.login(discordToken);
};

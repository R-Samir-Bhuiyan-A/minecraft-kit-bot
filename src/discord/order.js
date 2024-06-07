const fs = require('fs');
const { Client, Intents, IntentsBitField } = require('discord.js');

module.exports = (bot, discordToken, guildId) => {
    let chestsData = {}; // Store chest data
    let cooldowns = {}; // Store user cooldowns

    // Function to load chest data from JSON file
    const loadChestData = () => {
        try {
            const data = fs.readFileSync('chestData.json');
            chestsData = JSON.parse(data);
            console.log('Chest data loded (/order)');
        } catch (err) {
            console.error('Error loading delivery chest data:', err);
        }
    };

    // Function to load cooldown data from JSON file
    const loadCooldownData = () => {
        try {
            const data = fs.readFileSync('cooldown.json');
            cooldowns = JSON.parse(data);
            console.log('Cooldown loaded .');
        } catch (err) {
            console.error('Error loading cooldown data:', err);
        }
    };

    // Function to save cooldown data to JSON file
    const saveCooldownData = () => {
        try {
            fs.writeFileSync('cooldown.json', JSON.stringify(cooldowns, null, 4));
            console.log('Cooldown data saved successfully.');
        } catch (err) {
            console.error('Error saving cooldown data:', err);
        }
    };

    // Load chest and cooldown data on module initialization
    loadChestData();
    loadCooldownData();

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
        console.log('Discord bot is ready!(/order)');
    });

    discordClient.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const { commandName, options } = interaction;

        if (commandName === 'order') {
            const username = options.getString('username');
            const kitName = options.getString('kitname');
            const currentTime = Date.now();

            if (!chestsData[kitName]) {
                await interaction.reply('Invalid kit name. Please specify a valid kit.');
                return;
            }

            if (!cooldowns[username]) {
                cooldowns[username] = {};
            }

            if (cooldowns[username][kitName] && currentTime - cooldowns[username][kitName] < 86400000) { // 24 hours in milliseconds
                const remainingTime = 86400000 - (currentTime - cooldowns[username][kitName]);
                const hours = Math.floor(remainingTime / 3600000);
                const minutes = Math.floor((remainingTime % 3600000) / 60000);
                await interaction.reply(`You can claim this kit again in ${hours} hours and ${minutes} minutes.`);
                return;
            }

            // Update cooldown
            cooldowns[username][kitName] = currentTime;
            saveCooldownData();

            // Send order to another channel
            const targetChannelId = process.env.channelid;
            const targetChannel = discordClient.channels.cache.get(targetChannelId);
            if (targetChannel) {
                targetChannel.send(`!kit ${kitName} 1 ${username}`);
                await interaction.reply(`Your order for ${kitName} has been placed successfully! accept tpa from ${process.env.BOTNAME}`);
            } else {
                await interaction.reply('Error placing your order. Please try again later.');
            }
        }
    });

    // Log in to Discord
    discordClient.login(process.env.TOKEN2);
};

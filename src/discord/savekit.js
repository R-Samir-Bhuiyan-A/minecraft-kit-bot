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
            console.log('Chest data loded (/savekit)');
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
        console.log('Discord bot is ready!(/savekit)');
    });

    discordClient.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const { commandName, options } = interaction;

        if (commandName === 'savekit') {
            const kitName = options.getString('kitname');
            const x = options.getInteger('x');
            const y = options.getInteger('y');
            const z = options.getInteger('z');
            const item = options.getString('item');

            // Send order to another channel
            const targetChannelId = process.env.channelid;
            const targetChannel = discordClient.channels.cache.get(targetChannelId);
            if (targetChannel) {
                targetChannel.send(`!savekit ${kitName} ${x} ${y} ${z} ${item}`);
                await interaction.reply(`${kitName} Saved`);
            } else {
                await interaction.reply(`${kitName} not saved`);
            }
        }
    });

    // Log in to Discord
    discordClient.login(process.env.TOKEN2);
};

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');

// Load the chest data JSON file
let chestData = {};
try {
    const chestDataRaw = fs.readFileSync('./ChestData.json'); // Assuming ChestData.json is in the same directory as this script
    chestData = JSON.parse(chestDataRaw);
    console.log('Chest data loaded successfully.');
} catch (error) {
    console.error('Error loading chest data:', error);
}

// Extract the chest names from the loaded data
const chestNames = Object.keys(chestData);

// Define the commands with available chest choices
const commands = [
    {
        name: 'order',
        description: 'order a kit',
        options: [
            {
                name: 'kitname',
                description: 'Choose a kit',
                type: 3, // STRING
                required: true,
                choices: chestNames.map(name => ({ name, value: name }))
            },
            {
                name: 'username',
                description: 'give your username',
                type: 3, // STRING
                required: true
            }
        ]
    },
    {
        name: 'savekit',
        description: 'save a kit',
        options: [
            {
                name: 'kitname',
                description: 'Name of the kit to save',
                type: 3, // STRING
                required: true
            },
            {
                name: 'x',
                description: 'X coordinate',
                type: 4, // INTEGER
                required: true
            },
            {
                name: 'y',
                description: 'Y coordinate',
                type: 4, // INTEGER
                required: true
            },
            {
                name: 'z',
                description: 'Z coordinate',
                type: 4, // INTEGER
                required: true
            },
            {
                name: 'item',
                description: 'Item to save in the kit',
                type: 3, // STRING
                required: true
            }
        ]
    }
];


// Function to register slash commands
const registerSlashCommands = async (clientId, guildId, commands) => {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN2);

    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands } // Pass the commands array directly
        );
        console.log('Registered slash commands successfully!');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
};

// Register the slash commands
registerSlashCommands(process.env.CLIENT_ID2, process.env.GUILD_ID, commands);

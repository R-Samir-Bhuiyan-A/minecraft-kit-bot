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
        name: 'kit',
        description: 'admin kit command',
        options: [
            {
                name: 'kitname',
                description: 'Choose a  kit',
                type: 3, // STRING
                required: true,
                choices: chestNames.map(name => ({ name, value: name }))
            },
            {
                name: 'amount',
                description: 'amount of kits',
                type: 4, // STRING
                required: true
            },
            {
                name: 'username',
                description: 'give your username',
                type: 3, // STRING
                required: true
            }
        ]
    },
  
];

// Function to register slash commands
const registerSlashCommands = async (clientId, guildId, commands) => {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

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
registerSlashCommands(process.env.CLIENT_ID, process.env.GUILD_ID, commands);

require('dotenv').config();
const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN2);

(async () => {
    try {
        console.log('Fetching guild slash commands...');

        const commands = await rest.get(
            Routes.applicationGuildCommands(process.env.CLIENT_ID2, process.env.GUILD_ID)
        );

        console.log(`Deleting ${commands.length} slash commands...`);

        for (const command of commands) {
            await rest.delete(
                Routes.applicationGuildCommand(process.env.CLIENT_ID2, process.env.GUILD_ID, command.id)
            );
            console.log(`Deleted command: ${command.name}`);
        }

        console.log('All slash commands deleted successfully!');
    } catch (error) {
        console.error('Error deleting slash commands:', error);
    }
})();

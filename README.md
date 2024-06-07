# Mineflayer Kit Delivery Bot

## Overview
This bot facilitates kit delivery on anarchy Minecraft servers like 2b2t, 6b6t, and others. It allows for the easy delivery of predefined kits to players on demand, both in-game and through Discord.


# How the bot works

The bot operates by facilitating kit delivery through both in-game whisper commands and Discord slash commands. Here's a breakdown of how it functions:

1. **Saving Kits**: When a kit is saved either through a Discord slash command or an in-game whisper command, the bot records the chest location and all the items in the kit into the `chestData.json` file. This file acts as a database of saved kits, storing their respective chest locations and contents.

2. **Ordering Kits**: Players can request kits through either Discord slash commands or in-game whisper commands. When a kit is requested, the bot navigates to the specified chest location saved in `chestData.json`, retrieves the items from the chest, and delivers them to the player. 

3. **Special Handling for Specific Items**: If a kit contains special items like a `red_shulker_box`, the bot ensures that the chest is only filled with the specified item. This ensures that players receive exactly what they requested without any additional items.

4. **TPA Request**: After delivering the items, the bot sends a TPA (teleport request) to the player. The player needs to accept the TPA request to claim the items. Once the request is accepted, the player can proceed to kill the bot to obtain the items. 

5. **Bot Reset**: After delivering the items and completing the delivery process, the bot returns to its initial location, acting as a safeguard to prevent it from being left vulnerable in unknown locations. This ensures the bot's safety and enables it to continue facilitating kit deliveries efficiently.


## Installation
To use this bot, ensure you have Node.js installed on your system. If not, you can download and install it from the [Node.js website](https://nodejs.org/).

After Node.js is installed, follow these steps:

1. Install the bot dependencies by running the following command in your terminal:
    ```bash
    npm install
    ```

2. Start the bot by running:
    ```bash
    node .
    ```

3. Visit `localhost:8080` in your web browser to set up the required environment variables (`IP`, `PORT`, `BOTNAME`, `PASSWORD`, `OWNER`, `VERSION`, `TOKEN`, `TOKEN2`, `GUILD_ID`, `CLIENT_ID`, `CLIENT_ID2`, `channelid`, `SERVER_PORT`). These variables are necessary for the bot to function properly.

4. **After filling out the `.env` file or using the web UI to configure the environment variables, navigate to the web UI and click "Add Command". Wait until the process completes and you see a success message indicating that the setup is done.**

Once the setup is complete, you can start using the bot for kit delivery and other functions.

Note: Ensure you have two Discord bot tokens (`TOKEN` and `TOKEN2`) and a Discord server ID (`GUILD_ID`) ready before setting up the environment variables. Also, make sure to provide a valid `channelid` where bots will communicate, keeping it hidden from normal players for security purposes.

# Usage
## To run the bot, execute the following command:
```bash
node .
```
## Features

- **In-Game Commands**: Players can whisper commands to request kits or perform other actions.
  - **Whisper Command**: Players can whisper commands to the bot in-game to request kits or perform other actions. Available whisper commands are:
    - `kit (kit name) (amount) (username)`: Request a kit delivery for a specified amount to the given username.
    - `setkit (name) x y z (item)`: Save a kit with the specified name, coordinates, and item.
- **Discord Integration**: Supports Discord slash commands for administrative actions.
- **Kit Management**: Save and manage kits through JSON files.
- **Dark-Themed UI Dashboard**: Provides an advanced UI dashboard for administrative tasks.
- **Compatibility**: Compatible with any Minecraft version supported by Mineflayer.

## Discord Slash Commands

The bot also supports Discord slash commands for administrative actions. Available commands are:

- **/kit**
  - **Description**: Admin kit command
  - **Options**:
    - `kitname`: Choose a kit
    - `amount`: Amount of kits
    - `username`: Username

- **/order**
  - **Description**: Order a kit
  - **Options**:
    - `kitname`: Choose a kit
    - `username`: Username

- **/savekit**
  - **Description**: Save a kit
  - **Options**:
    - `kitname`: Name of the kit to save
    - `x`: X coordinate
    - `y`: Y coordinate
    - `z`: Z coordinate
    - `item`: Item to save in the kit
   
    


## How the bot works

---

With its comprehensive set of features, the Mineflayer Kit Delivery Bot provides a seamless experience for managing kit delivery and administrative tasks in Minecraft servers. Enhance your server management capabilities today!



---

# Keywords
2b2t kit delivery bot, 6b6t kit delivery bot, Minecraft kit delivery bot, Mineflayer bot, Minecraft server management, Minecraft kit management, Discord integration, Minecraft anarchy server, Whisper commands, Discord slash commands, JSON file management, Anarchy server management, Discord-controlled bot, Mineflayer bot for 2b2t, Discord-managed Minecraft bot, Anarchy server administration, Discord-controlled Mineflayer bot



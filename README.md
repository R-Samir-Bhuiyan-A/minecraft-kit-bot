# Mineflayer Kit Delivery Bot

## Overview
This bot facilitates kit delivery on anarchy Minecraft servers like 2b2t, 6b6t, and others. It allows for the easy delivery of predefined kits to players on demand, both in-game and through Discord.

## Installation
To install the bot, simply run the following command:
```bash
npm install
```
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



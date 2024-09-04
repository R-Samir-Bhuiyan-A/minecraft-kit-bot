# Mineflayer Kit Delivery Bot

## Overview
This bot facilitates kit delivery on anarchy Minecraft servers like 2b2t, 6b6t, and others. It allows for the easy delivery of predefined kits to players on demand, both in-game and through Discord.


# How the bot works

The bot operates by facilitating kit delivery through both in-game whisper commands and Discord slash commands. Here's a breakdown of how it functions:

1. **Saving Kits**: When a kit is saved either through a Discord slash command or an in-game whisper command, the bot records the chest location and items`chestData.json` file. This file acts as a database of saved kits, storing their respective chest locations and contents.

2. **Ordering Kits**: Players can request kits through either Discord slash commands or in-game whisper commands. When a kit is requested, the bot navigates to the specified chest location saved in `chestData.json`, retrieves the items from the chest.

3. **Handling for Specific Items**: If a chest contains items like a `red_shulker_box`, their should be only `red_shulker_box` in the chest  This ensures that players receive exactly what they requested without any additional items.

4. **TPA Request**: the bot sends a TPA (teleport request) to the player. The player needs to accept the TPA request to claim the items. Once the request is accepted, the player can proceed to kill the bot to obtain the items. 

5. **Bot Reset**: After delivering the items and completing the delivery process, the bot returns to its initial location, acting as a safeguard to prevent it from being left vulnerable in unknown locations. This ensures the bot's safety and enables it to continue facilitating kit deliveries efficiently.


## Installation for linux
To use this bot, ensure you have Node.js installed on your system. If not, you can download and install it from the [Node.js website](https://nodejs.org/).

After Node.js is installed, follow these steps:
 
## Installation Script

The installation script sets up the MDB environment by installing necessary packages, Node.js, and configuring services and Nginx. It also provides options for different Node.js versions and configures the environment with user input.

### Download and Run the Installation Script

To download and run the installation script, use the following command:

```bash
wget https://github.com/R-Samir-Bhuiyan-A/mdb_install/releases/download/install/install.sh && bash install.sh
```



### Download and Run the uninstallation Script

To download and run the uninstallation script, use the following command:

```bash
wget https://github.com/R-Samir-Bhuiyan-A/mdb_install/releases/download/uninstall/uninstall.sh && bash uninstall.sh
```

1. panel start
    ```bash
    systemctl start mdb
    ```

2. panel stop
     ```bash
     systemctl stop mdb
     ```
3. panel restart
     ```bash
     systemctl restart mdb
     ```

4. api demon start
    ```bash
    systemctl start mdbr
    ```

5. api demon stop
     ```bash
     systemctl stop mdbr
     ```
6. api demon restart
     ```bash
     systemctl restart mdbr
     ```     


   

5. Visit `io/domain:port` in your web browser to set up the required environment variables (`IP`, `PORT`, `BOTNAME`, `PASSWORD`, `VERSION`, `SERVER_PORT`, `WS_PORT`). These variables are necessary for the bot to function properly.


## Installation for Windows 

To use this bot, ensure you have Node.js installed on your system. If not, you can download and install it from the [Node.js website](https://nodejs.org/)

1. DOWNLOAD the latest [release](https://github.com/R-Samir-Bhuiyan-A/minecraft-kit-bot/releases/download/mdb2.0/MDB.zip)
2. unzip it  
3. Install modules needed for this by running in cmd ( on the folder where you unziped it)
     ```bash
     npm install 
     ```
 4. To start the bot
      ```bash
     node server.js 
     ```   
## HOW to make it auto start in windows 

1. Press Win + R to open the Run dialog.
2. Type
  ```bash
    shell:startup  
   ```
and press Enter.
3. make mdb.bat in startup 
4. And paste this
 ```bash
node /path/to/server.js
```


# API Documentation

Welcome to the API documentation for managing the Minecraft bot. Below you will find detailed information on how to use the API endpoints to interact with the bot.

## API Endpoints

### 1. Make the Bot Leave the Server
**Endpoint:** `/api/bot/leave`
**Method:** POST
**Description:** Sends a request to make the bot leave the Minecraft server.
**How to Use:**
- Use this endpoint when you want the bot to leave the server immediately.
- Make a POST request to the endpoint.
**Response Codes:**
- **3:** Successfully made the bot leave the server.
- **4:** The bot is not online; no action was taken.
**Example Request:**
```bash
curl -X POST http://yourdomain.com/api/bot/leave
```
**Example Response:**
```json
3
```

### 2. Check Bot Status
**Endpoint:** `/api/status`
**Method:** POST
**Description:** Checks the current status of the bot to see if it is online or not.
**How to Use:**
- Use this endpoint to verify if the bot is currently online.
- Make a POST request to the endpoint.
**Response Codes:**
- **1:** The bot is online.
- **2:** The bot is not online.
**Example Request:**
```bash
curl -X POST http://yourdomain.com/api/status
```
**Example Response:**
```json
1
```

### 3. Order Items from a Chest
**Endpoint:** `/api/order`
**Method:** POST
**Description:** Places an order for a specified amount of items from a chest for a player.
**How to Use:**
- Use this endpoint to order items from a chest in the game.
- Include the following data in the request body:
  - **chestName**: Name of the chest from which items are ordered.
  - **amount**: Number of items to order.
  - **player**: Name of the player who will receive the items.
- Make a POST request to the endpoint with the required data.
**Request Body Example:**
```json
{
  "chestName": "exampleChest",
  "amount": 10,
  "player": "examplePlayer"
}
```
**Response Messages:**
- **Success:** A confirmation message indicating the items were ordered.
- **Error:** An error message if the chest data is missing or if there is a problem processing the order.
**Example Request:**
```bash
curl -X POST http://yourdomain.com/api/order -H "Content-Type: application/json" -d "{\"chestName\":\"exampleChest\",\"amount\":10,\"player\":\"examplePlayer\"}"
```
**Example Response:**
```text
Ordered 10 items from "exampleChest" for examplePlayer.
```

## Summary
- **Base URL:** Replace `http://yourdomain.com` with the actual base URL where your API is hosted.


# demon API

### 1. Restart the Node.js Application
**Endpoint:** /restart
**Method:** POST
**Description:** Sends a request to restart the Node.js application.
**How to Use:**
- Use this endpoint to restart the application when needed.
- Make a POST request to the endpoint.
**Response Messages:**
- **Success:** Application restarted successfully.
- **Error:** Failure message if the application fails to restart.
**Example Request:**
```bash
curl -X POST http://yourdomain.com/restart
```
**Example Response:**
```text
Application restarted successfully
```

### 2. Start the Node.js Application
**Endpoint:** /start
**Method:** POST
**Description:** Sends a request to start the Node.js application.
**How to Use:**
- Use this endpoint to start the application if it is not running.
- Make a POST request to the endpoint.
**Response Messages:**
- **Success:** Application started successfully.
- **Error:** Failure message if the application fails to start.
**Example Request:**
```bash
curl -X POST http://yourdomain.com/start
```
**Example Response:**
```text
Application started successfully
```

### 3. Stop the Node.js Application
**Endpoint:** /stop
**Method:** POST
**Description:** Sends a request to stop the Node.js application.
**How to Use:**
- Use this endpoint to stop the application when needed.
- Make a POST request to the endpoint.
**Response Messages:**
- **Success:** Application stopped successfully.
- **Error:** Failure message if the application fails to stop.
**Example Request:**
```bash
curl -X POST http://yourdomain.com/stop
```
**Example Response:**
```text
Application stopped successfully
```

## Summary
- **Base URL:** Replace `http://yourdomain.com:port` with the actual base URL where your API is hosted.



With its comprehensive set of features, the Mineflayer Kit Delivery Bot provides a seamless experience for managing kit delivery and administrative tasks in Minecraft servers. Enhance your server management capabilities today!



---

# Keywords
2b2t kit delivery bot, 6b6t kit delivery bot, Minecraft kit delivery bot, Mineflayer bot, Minecraft server management, Minecraft kit management, Discord integration, Minecraft anarchy server, Whisper commands, Discord slash commands, JSON file management, Anarchy server management, Discord-controlled bot, Mineflayer bot for 2b2t, Discord-managed Minecraft bot, Anarchy server administration, Discord-controlled Mineflayer bot



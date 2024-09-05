const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const session = require('express-session');
const botUtils = require('./bot'); // Import bot utilities
const bot = require('./src/index'); // Import the bot instance
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();



const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Configure bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure express-session
app.use(session({
  secret: 'samir', // Change this to a random secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure: true if using HTTPS
}));

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  }
  res.redirect('/login');
};

// Configure EJS view engine and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure views directory is set correctly

// Serve static files from 'public'
//app.use(express.static(path.join(__dirname, 'views')));



// Define routes
app.get('/', isAuthenticated, (req, res) => {
  // Read .env file
  const envData = fs.readFileSync('.env', 'utf8');
  // Parse .env data into key-value pairs
  const envVariables = envData.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key) {
      acc[key] = value;
    }
    return acc;
  }, {});

  // Render the template with environment variables
  res.render('index', { envVariables });
});

// Handle form submission to update the .env file
app.post('/update', (req, res) => {
  const updatedEnvVariables = req.body;

  // Prepare new .env file content
  const newEnvContent = Object.entries(updatedEnvVariables)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

  // Write the new content to the .env file
  fs.writeFileSync('.env', newEnvContent, 'utf-8');

  // Reload environment variables
  require('dotenv').config();

  res.redirect('/');
});

app.get('/login', (req, res) => {
  res.render('login', { session: req.session }); // Pass session object to the view
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Simple username/password check
  if (username === process.env.UI_USER && password === process.env.UI_PASSWORD) { // Change credentials as needed
    req.session.loggedIn = true;
    res.redirect('/');
  } else {
    req.session.errorMessage = 'Password incorrect'; // Set error message
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Failed to log out.');
    }
    res.redirect('/login');
  });
});



// Serve JSON file editor
app.get('/json', isAuthenticated, (req, res) => {
  // Read chestData.json file
  const jsonData = JSON.parse(fs.readFileSync('chestData.json', 'utf8'));
  res.render('json', { jsonData });
});

app.post('/update-json', isAuthenticated, (req, res) => {
  const newData = req.body.jsonData; // Extract JSON data from request body
  fs.writeFile('chestData.json', newData, (err) => {
    if (err) {
      console.error('Error saving JSON data:', err);
      return res.status(500).json({ message: 'Failed to save JSON data.' });
    }
    console.log('JSON data saved successfully.');
    res.status(200).json({ message: 'JSON data saved successfully.' });
  });
});

let chestsData = {};

// Load chest data from JSON file
const loadChestData = () => {
    try {
        const data = fs.readFileSync('chestData.json');
        chestsData = JSON.parse(data);
        console.log('Chest data loaded.');
    } catch (err) {
        console.error('Error loading chest data:', err);
    }
};


// Save chest data to JSON file
const saveChestData = () => {
  try {
      fs.writeFileSync('chestData.json', JSON.stringify(chestsData, null, 4));
      console.log('Chest data saved successfully.');
  } catch (err) {
      console.error('Error saving chest data:', err);
  }
};

// Load data on server start
loadChestData();
// Route to save chest data
app.post('/chest/save-chest', (req, res) => {
  const { chestName, x, y, z, item } = req.body;

  // Parse coordinates as integers
  const xCoord = parseInt(x, 10);
  const yCoord = parseInt(y, 10);
  const zCoord = parseInt(z, 10);

  if (!chestName || isNaN(xCoord) || isNaN(yCoord) || isNaN(zCoord) || !item) {
      return res.status(400).send('Invalid data');
  }

  chestsData[chestName] = { x: xCoord, y: yCoord, z: zCoord, item };
  saveChestData();
  res.send('Chest data saved successfully.');
});

// Route to edit chest data
app.put('/chest/edit-chest', (req, res) => {
  const { chestName, x, y, z, item } = req.body;

  // Parse coordinates as integers
  const xCoord = parseInt(x, 10);
  const yCoord = parseInt(y, 10);
  const zCoord = parseInt(z, 10);

  if (!chestName || isNaN(xCoord) || isNaN(yCoord) || isNaN(zCoord) || !item) {
      return res.status(400).send('Invalid data');
  }

  if (!chestsData[chestName]) {
      return res.status(404).send('Chest not found');
  }

  chestsData[chestName] = { x: xCoord, y: yCoord, z: zCoord, item };
  saveChestData();
  res.send('Chest data edited successfully.');
});

// Route to delete chest data
app.delete('/chest/delete-chest', (req, res) => {
  const { chestName } = req.body;

  if (!chestName) {
      return res.status(400).send('Chest name required');
  }

  if (!chestsData[chestName]) {
      return res.status(404).send('Chest not found');
  }

  delete chestsData[chestName];
  saveChestData();
  res.send('Chest data deleted successfully.');
});
// Route to get all chest data
app.get('/chest/all-chests', (req, res) => {
  res.json(chestsData);
});



// Endpoint to get all chests
app.get('/api/chests', (req, res) => {
  res.json(chestsData);
});


const { takeItemFromChest } = botUtils(bot); // Use destructuring to get takeItemFromChest

app.post('/api/order', (req, res) => {
  const { chestName, amount, player } = req.body;
  const chestData = chestsData[chestName];

  if (chestData && chestData.x && chestData.y && chestData.z && chestData.item) {
    takeItemFromChest(chestName, amount, player) // Directly use takeItemFromChest
      .then(() => {
        res.send(`Ordered ${amount} ${chestData.item} from "${chestName}" for ${player}.`);
      })
      .catch((err) => {
        console.error('Error taking item from chest:', err);
        res.status(500).send('Failed to take item from chest.');
      });
  } else {
    res.status(400).send(`Chest "${chestName}" data not found or incomplete.`);
  }
});

console.log('takeItemFromChest is a function:', typeof takeItemFromChest === 'function');



// Route to render kits page
app.get('/kits', isAuthenticated, (req, res) => {
  res.render('kit'); // Render kit.ejs
});

// Route to render control page
app.get('/control',(req, res) => {
  res.render('bot'); // Render bot.ejs
});

// Route to render chest page
app.get('/chest', isAuthenticated, (req, res) => {
  res.render('chest'); // Render chest.ejs
});

// API endpoint to make the bot leave the server
app.post('/api/bot/leave', (req, res) => {
    if (bot.player && bot.player.entity) {
        bot.quit('Leaving the server as requested via API');
        console.log("Leaving the server as requested via API");
        res.json(3);
    } else {
        res.json(4);
    }
});



// Route to check if the bot is online
app.post('/api/status', (req, res) => {
  // Check if the bot is online
  if (bot.player && bot.player.entity) {
    // Bot is online
    res.json('1');
  } else {
    // Bot is not online
    res.json('2');
  }
});

app.get('/chat', isAuthenticated, (req, res) => {
    res.render('chat'); // Render chat.ejs
});


// Increase max listeners to avoid warnings
require('events').EventEmitter.defaultMaxListeners = 20;

// Start server
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

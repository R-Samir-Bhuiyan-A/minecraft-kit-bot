const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));

// Define routes
app.get('/', (req, res) => {
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

// Serve JSON file editor
app.get('/json', (req, res) => {
  // Read chestData.json file
  const jsonData = JSON.parse(fs.readFileSync('chestData.json', 'utf8'));
  res.render('json', { jsonData });
});




app.post('/update-json', (req, res) => {
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






app.post('/delete', (req, res) => {
  exec('node src/discord/delete1.js && node src/discord/delete.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.json({ message: 'Failed to delete the command.' });
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.json({ message: 'Command deleted successfully.' });
  });
});

app.post('/add', (req, res) => {
  exec('node src/discord/command1.js && node src/discord/command.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.json({ message: 'Failed to add the command.' });
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.json({ message: 'Command added successfully.' });
  });
});

// Start server
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

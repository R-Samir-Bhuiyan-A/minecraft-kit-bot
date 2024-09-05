const express = require('express');
const { exec } = require('child_process');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Endpoint to restart the Node.js application
app.post('/restart', (req, res) => {
    exec('sudo systemctl restart mdb', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error restarting the application: ${error}`);
            return res.status(500).send('Failed to restart the application');
        }
        console.log(`Restart output: ${stdout}`);
        res.send('Application restarted successfully');
    });
});

// Endpoint to start the Node.js application
app.post('/start', (req, res) => {
    exec('sudo systemctl start mdb', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting the application: ${error}`);
            return res.status(500).send('Failed to start the application');
        }
        console.log(`Start output: ${stdout}`);
        res.send('Application started successfully');
    });
});

// Endpoint to stop the Node.js application
app.post('/stop', (req, res) => {
    exec('sudo systemctl stop mdb', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error stopping the application: ${error}`);
            return res.status(500).send('Failed to stop the application');
        }
        console.log(`Stop output: ${stdout}`);
        res.send('Application stopped successfully');
    });
});

app.listen(process.env.WS_PORT, () => {
    console.log(`Server is running on port ${process.env.WS_PORT}`);
});

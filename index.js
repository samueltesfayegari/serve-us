const express = require('express');
const fs = require('fs');
const https = require('https');
const { exec } = require('child_process');

const app = express();

// Function to make a request with TLS certificate validation ignored
function makeRequest(url, options) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
}

// Route to refresh data
app.get('/refresh', (req, res) => {
    // Run index.js to update response.json
    exec('node index.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing index.js: ${error.message}`);
            res.status(500).send('Error refreshing data');
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
        res.send('Data refreshed successfully.');
    });
});

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

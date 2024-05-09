const express = require('express');
const https = require('https');

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

// Define handler for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the API! Please use /data endpoint to get data.');
});

// API endpoint to get data
app.get('/data', async (req, res) => {
    try {
        const url = 'https://old.html5-chat.com:2083/getusers/16261/1';
        const options = {
            method: 'GET',
            // Ignoring TLS certificate validation
            rejectUnauthorized: false
        };

        const data = await makeRequest(url, options);
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

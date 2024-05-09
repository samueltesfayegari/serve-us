const fs = require('fs');
const https = require('https');

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

// URL and options for the HTTPS request
const url = 'https://old.html5-chat.com:2083/getusers/16261/1';
const options = {
    method: 'GET',
    // Ignoring TLS certificate validation
    rejectUnauthorized: false
};

// Make the HTTPS request
makeRequest(url, options)
    .then((data) => {
        // Save response data to JSON file
        fs.writeFile('response.json', data, (err) => {
            if (err) {
                console.error('Error writing JSON file:', err);
            } else {
                console.log('Response data saved to response.json');
            }
        });
    })
    .catch((err) => {
        console.error('Error:', err);
    });

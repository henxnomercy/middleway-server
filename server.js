const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

const app = express();
app.use(bodyParser.json());

// Unity WebSocket
const wss = new WebSocket.Server({ port: 8080 });
let unityClient = null;

wss.on('connection', (ws) => {
    console.log('Unity terhubung');
    unityClient = ws;

    ws.on('message', (message) => {
        console.log('Pesan dari Unity:', message);
    });

    ws.on('close', () => {
        console.log('Unity terputus');
        unityClient = null;
    });
});

// Receive RBX
app.post('/fromRoblox', (req, res) => {
    const data = req.body;
    console.log('Data dari Roblox:', data);

    // Send UTY
    if (unityClient) {
        unityClient.send(JSON.stringify(data));
    }

    res.status(200).send('Data diterima dan diteruskan ke Unity!');
});

// Send UTY
app.get('/toRoblox', (req, res) => {
    const data = { message: 'Halo dari middleware!' };
    res.json(data);
});

// Run Express
app.listen(3000, () => {
    console.log('Middleware berjalan di http://localhost:3000');
});

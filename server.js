const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

const app = express();
app.use(bodyParser.json());

// Buat server HTTP untuk Express dan WebSocket
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});

// WebSocket Server menggunakan server HTTP
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Unity terhubung');
    ws.on('message', (message) => {
        console.log('Pesan dari Unity:', message);
    });
    ws.on('close', () => {
        console.log('Unity terputus');
    });
});

// Endpoint HTTP untuk menerima data dari Roblox
app.post('/fromRoblox', (req, res) => {
    const data = req.body;
    console.log('Data dari Roblox:', data);

    // Kirim data ke semua client WebSocket
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });

    res.status(200).send('Data diterima dan diteruskan ke Unity!');
});

app.get('/toRoblox', (req, res) => {
    const data = { message: 'Halo dari middleware!' };
    res.json(data);
});

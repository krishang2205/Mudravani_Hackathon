const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');

// Initialize express and create an HTTP server
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Enable CORS for WebSocket connections
app.use(cors());

// Serve static files (if frontend is hosted here)
app.use(express.static('public'));

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });

const clients = new Set();

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  clients.add(ws);

  ws.on('message', (message) => {
    console.log('Received message:', message.toString());

    // Broadcast message to all clients except sender
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

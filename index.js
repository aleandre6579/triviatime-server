const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  io.to("QWOP").emit("chat message", "a user joined the room.");
  socket.join("QWOP");
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.to("QWOP").emit("chat message", "a user left the room.");
    socket.leave("QWOP");
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

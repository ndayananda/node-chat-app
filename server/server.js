const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const app = express();
const port = process.env.PORT || 3000;

/**
 * While using socket.io then we have to use http to create server.
 * http is built-in module in Node.js designed to support many features of the protocol which have been traditionally difficult to use. 
 * Creating server was handled in app.listen method inside express, while using express. But to use socket we have to do it explicitly.
 */
const server = http.createServer(app);

// After creating the server, we need to pass it to socketIO
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    // socket.emit will emit event to particular connection
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    // socket.broadcast.emit will emit event to all the connection except the one emitting
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'new user joined'));

    socket.on('createMessage', function(msg, callback) {
        // io.emit will emit event to all
        io.emit('newMessage', generateMessage(msg.from, msg.text));
        if(callback && typeof callback === 'function')
            callback({
                success: true,
                data: 'Successfully created a message'
            });
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from client');
    });
});

// While using socket.io and express we have to call listen method on server insted of app
server.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
});



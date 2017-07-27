const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const _ = require('lodash');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {Users} = require('./utils/users');

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

// Create a instanse of Users to keep the users list
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    socket.on('join', (params, callback) => {
        if( _.isEmpty(params.name) || _.isEmpty(params.room) ) {
            callback({
                success: false,
                data: 'Name and Room Name are required!'
            });
        }

        callback({
            success: true,
            data: params.name + ' joined room'
        });

        socket.join(params.room); // creates a seperate room / adds if already exits one for tracking
        users.removeUser(socket.id); // Remove the user from other rooms if exists
        users.addUser(socket.id, params.name, params.room);

        // io.to(params.room).emit will emit event to all in the provided room
        io.to(params.room).emit('updateUserList', users.getUsersList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

        // socket.broadcast.emit will emit event to all in the provided room except the one emitting
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    });

    socket.on('createMessage', (msg, callback) => {
        // io.emit will emit event to all
        io.emit('newMessage', generateMessage(msg.from, msg.text));
        if(callback && typeof callback === 'function')
            callback({
                success: true,
                data: 'Successfully created a message!'
            });
    });

    socket.on('createLocationMessage', (coords, callback) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));

        if(callback && typeof callback === 'function')
            callback({
                success: true,
                data: 'Successfully created location message!'
            });
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('updateUserList', users.getUsersList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));            
        }
    });
});

// While using socket.io and express we have to call listen method on server insted of app
server.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
});



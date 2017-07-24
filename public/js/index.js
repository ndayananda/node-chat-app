(function(global, undefined) {
    var socket = io();
    socket.on('connect', function() {
        console.log('Connected to server');

        socket.on('newMessage', function(msg) {
            console.log('New Message: ', msg);
        })

        socket.emit('createMessage', {
            to: 'Malini',
            text: 'Hey! How are u?'
        });
    });

    socket.on('disconnect', function() {
        console.log('Disconnected from server');
    })
})(window);
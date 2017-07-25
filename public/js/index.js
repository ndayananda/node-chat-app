(function(global, $, undefined) {
    var socket = io();
    socket.on('connect', function() {
        console.log('Connected to server');

        socket.on('newMessage', function(msg) {
            var li = $('<li>');
            li.text(msg.from + ': ' + msg.text);
            $('#messages').append(li);
        });
    });

    socket.on('disconnect', function() {
        console.log('Disconnected from server');
    });

    $('#message-form').on('submit', function(e) {
        e.preventDefault();

        socket.emit('createMessage', {
            from: 'User',
            text: $('[name=message]').val()
        }, function(result) {
            if(result.success) 
                console.log(result.data);
        });
    });
})(window, jQuery);
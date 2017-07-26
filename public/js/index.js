(function(global, $, undefined) {
    var socket = io();
    socket.on('connect', function() {
        console.log('Connected to server');

        socket.on('newMessage', function(msg) {
            var li = $('<li>');
            li.text(msg.from + ': ' + msg.text);
            $('#messages').append(li);
        });

        socket.on('newLocationMessage', function(locationInfo) {
            var li = $('<li>');
            var link = $('<a target="_blank">My Current Location</a>');
            link.attr('href', locationInfo.url);

            li.text(locationInfo.from + ': ');
            li.append(link);
            $('#messages').append(li);
        });
    });

    socket.on('disconnect', function() {
        console.log('Disconnected from server');
    });

    $('#message-form').on('submit', function(e) {
        e.preventDefault();
        var input = $('[name=message]');

        socket.emit('createMessage', {
            from: 'User',
            text: input.val()
        }, function(result) {
            if(result.success) 
                input.val('');
        });
    });

    $('#location-button').on('click', function() {
        if(!navigator.geolocation) {
            return alert('Geolocation is not supported on your browser!');
        }

        var $button = $(this);
        $button.attr('disabled', 'disabled').text('Sending location...');

        navigator.geolocation.getCurrentPosition(function(pos) {
            $button.removeAttr('disabled').text('Send location');
            socket.emit('createLocationMessage', {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            }, function(result) {
                if(result.success) 
                    console.log(result.data);
            });
        }, function() {
            alert('Unbale to fetch location!');
            $button.removeAttr('disabled').text('Send location');
        });
    });
})(window, jQuery);
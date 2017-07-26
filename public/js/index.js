(function(global, $, undefined) {
    var socket = io();
    socket.on('connect', function() {
        console.log('Connected to server');

        socket.on('newMessage', function(msg) {
            renderTemplate(msg);
        });

        socket.on('newLocationMessage', function(locationInfo) {
            renderTemplate(locationInfo);
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

    function renderTemplate(data) {
        var formattedTime, template, html;
        
        formattedTime = moment(data.createdAt).format('h:mm a');

        template = $('#message-template').html();

        html = Mustache.render(template, {
            from: data.from,
            text: data.text,
            createdAt: formattedTime,
            url: data.url
        });
        
        $('#messages').append(html);
    }
})(window, jQuery);
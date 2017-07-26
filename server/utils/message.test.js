const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('Generate Message', () => {
    it('Should generate correct message object and return', () => {
        var from = 'Naveen';
        var text = 'Welcome dude';
        var msg = generateMessage(from, text);

        expect(msg.createdAt).toBeA('number');
        expect(msg).toInclude({from, text});
    });
});

describe('Generate Location Message', () => {
    it('Should generate a location object with location URL and return', () => {
        var from = 'Admin',
            latitude = 12.914806899999999,
            longitude = 77.68483309999999;
            
        var locationInfo = generateLocationMessage(from, latitude, longitude);

        expect(locationInfo.createdAt).toBeA('number');
        expect(locationInfo).toInclude({from, url: 'https://www.google.com/maps?q=12.914806899999999,77.68483309999999'});
    });
});
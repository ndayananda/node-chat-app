const expect = require('expect');

const {generateMessage} = require('./message');

describe('Generate Message', () => {
    it('Should generate correct message object and return', () => {
        var from = 'Naveen';
        var text = 'Welcome dude';
        var msg = generateMessage(from, text);

        expect(msg.createdAt).toBeA('number');
        expect(msg).toInclude({from, text});
    });
});
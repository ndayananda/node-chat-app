const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Naveen',
            room: 'Node Course'
        }, {
            id: '2',
            name: 'Sachin',
            room: 'EXTJS Course'
        }, {
            id: '3',
            name: 'Ammi Reddy',
            room: 'Node Course'
        }];
    });

    it('Should add new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: 'Naveen',
            room: 'Test Room'
        };

        users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('Should return users mapped to room "Node Course"', () => {
        var userList = users.getUsersList('Node Course');

        expect(userList).toEqual(['Naveen', 'Ammi Reddy']);
    });

    it('Should return users mapped to room "EXTJS Course"', () => {
        var userList = users.getUsersList('EXTJS Course');

        expect(userList).toEqual(['Sachin']);
    });

    it('Should return user if found', () => {
        var user = users.getUser('2');

        expect(user).toEqual(users.users[1]);
    });

    it('Should return null if user not found', () => {
        var user = users.getUser('5');

        expect(user).toNotExist();
    });

    it('Should remove user if found', () => {
        var user = users.removeUser('2');

        expect(users.users.length).toBe(2);
        expect(user).toEqual({
            id: '2',
            name: 'Sachin',
            room: 'EXTJS Course'
        });
    });

    it('Should not remove user if not found', () => {
        var user = users.removeUser('5');
        
        expect(users.users.length).toBe(3);
        expect(user).toNotExist();
    });
});
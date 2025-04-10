const auth = require('../auth');
const register = require('../register');
const upgrades = require('../upgrades')
const bcrypt = require('bcrypt');
const pool = require('../utils/db');

describe('Register function', () => {
    test('Register function should return a 400 status if username or password is missing', async () => {
        const req = { body: { username: '', password: '' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await register.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Please provide a username and password' });
    })
    test('Register function should return a 409 status if user already exists', async () => {
        const req = { body: { username: 'testuser', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(pool, 'query').mockResolvedValue([[{ username: 'testuser' }]]);

        await register.register(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    })
    test('Register function should return a 201 status if user is created successfully', async () => {
        const req = { body: { username: 'newuser', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(pool, 'query').mockResolvedValue([[]]);

        await register.register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'User created' });
    })
    test('Register function should return a 500 status if an error occurs', async () => {
        const req = { body: { username: 'newuser', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(pool, 'query').mockRejectedValue(new Error('Database error'));

        await register.register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error registering user' });
    })
})

describe('Login function', () => {
    test('Login function should return a 400 status if username or password is missing', async () => {
        const req = { body: { username: '', password: '' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await auth.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Please provide a username and password' });
    })
    test('Login function should return a 401 status if user does not exist', async () => {
        const req = { body: { username: 'nonexistentuser', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(pool, 'query').mockResolvedValue([[]]);

        await auth.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'This user does not exist' });
    })
    test('Login function should return a 401 status if password is invalid', async () => {
        const req = { body: { username: 'testuser', password: 'wrongpassword' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const user = { id: 1, username: 'testuser', password: await bcrypt.hash('password', 10) };
        jest.spyOn(pool, 'query').mockResolvedValue([[user]]);

        await auth.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    })
    test('Login function should return a token and user_id if credentials are valid', async () => {
        const req = { body: { username: 'testuser', password: 'password' } };
        const res = {
            json: jest.fn(),
        };

        const user = { id: 1, username: 'testuser', password: await bcrypt.hash('password', 10) };
        jest.spyOn(pool, 'query').mockResolvedValue([[user]]);

        await auth.login(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            accessToken: expect.any(String),
            user_id: expect.any(Number),
        }));
    })
    test('Login function should return a 500 status if an error occurs', async () => {
        const req = { body: { username: 'testuser', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(pool, 'query').mockRejectedValue(new Error('Database error'));

        await auth.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    })
})
describe('Upgrades function', () => {
    test('saveUpgrades function should return a 500 status if an error occurs', async () => {
        const req = { params: { id: 1 }, body: { user_upgrades: { clicker: 1, oven: 2 }, clicks: 100 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(pool, 'query').mockRejectedValue(new Error('Database error'));

        await upgrades.saveUpgrades(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error saving upgrades' });
    })
})
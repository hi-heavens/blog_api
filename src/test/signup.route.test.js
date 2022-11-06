const supertest = require('supertest');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const app = require('../app');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const connectionToMongoDB = require("../../config/database");

const api = supertest(app);

describe('User signup and login successfully', () => {
    beforeAll(async () => {
        app.listen(() => {});
        await connectionToMongoDB();
        await User.deleteMany({});
    }, 60000);

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new user', async () => {
        const newUser = {
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@email.com',
            password: 'password',
        };
        const response = await api.post('/api/v1/user/signup').send(newUser);

        expect(response.status).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.data.user).toHaveProperty('first_name');
        expect(response.body).toHaveProperty('token');
    }, 60000);

    it('User login successfully', async () => {
        const existUser = {
            email: 'johndoe@email.com',
            password: 'password',
        };
        const response = await api.post('/api/v1/user/login').send(existUser);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body).toHaveProperty('author_id');
        expect(response.body).toHaveProperty('token');
    }, 60000);

});
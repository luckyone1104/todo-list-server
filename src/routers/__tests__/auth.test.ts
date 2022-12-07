import request from 'supertest';
import app from '../../app';
import { mockUsers } from '../../__tests__/mocks';

const getRandomString = () => {
    return Math.random().toString(36).substring(2);
};

const getRandomEmail = () => {
    const randomString = getRandomString();
    return `${randomString}@random.mail`;
};

describe('/auth', () => {
    describe('POST /auth/register', () => {
        test('should register user', async () => {
            const mockUser = {
                name: getRandomString(),
                email: getRandomEmail(),
                password: getRandomString(),
            };

            const response = await request(app)
                .post('/auth/register')
                .send(mockUser);

            expect(response.statusCode).toBe(201);
            expect(response.headers['set-cookie']).toBeDefined();
            expect(typeof response.body.id).toBe('string');
            expect(response.body.name).toBe(mockUser.name);
            expect(response.body.email).toBe(mockUser.email);
        });

        test('should respond with 400 because of missing name', async () => {
            const mockUser = {
                email: getRandomEmail(),
                password: getRandomString(),
            };

            const response = await request(app)
                .post('/auth/register')
                .send(mockUser);

            expect(response.statusCode).toBe(400);
        });

        test('should respond with 400 because of missing email', async () => {
            const mockUser = {
                name: getRandomString(),
                password: getRandomString(),
            };

            const response = await request(app)
                .post('/auth/register')
                .send(mockUser);

            expect(response.statusCode).toBe(400);
        });

        test('should respond with 400 because of missing password', async () => {
            const mockUser = {
                name: getRandomString(),
                email: getRandomEmail(),
            };

            const response = await request(app)
                .post('/auth/register')
                .send(mockUser);

            expect(response.statusCode).toBe(400);
        });

        test('should respond with 400 because of invalid email', async () => {
            const mockUser = {
                name: getRandomString(),
                email: 'invalid-email',
                password: getRandomString(),
            };

            const response = await request(app)
                .post('/auth/register')
                .send(mockUser);

            expect(response.statusCode).toBe(400);
        });

        test('should respond with 400 because of invalid password', async () => {
            const mockUser = {
                name: getRandomString(),
                email: getRandomEmail(),
                password: '2short',
            };

            const response = await request(app)
                .post('/auth/register')
                .send(mockUser);

            expect(response.statusCode).toBe(400);
        });

        test('should respond with 400 because of duplicate email', async () => {
            const mockUser = {
                name: getRandomString(),
                email: mockUsers[0].email,
                password: getRandomString(),
            };

            const response = await request(app)
                .post('/auth/register')
                .send(mockUser);

            expect(response.statusCode).toBe(400);
        });

        test('should respond with 400 because of duplicate name', async () => {
            const mockUser = {
                name: mockUsers[0].name,
                email: getRandomEmail(),
                password: getRandomString(),
            };

            const response = await request(app)
                .post('/auth/register')
                .send(mockUser);

            expect(response.statusCode).toBe(400);
        });
    });

    describe('POST /auth/login', () => {
        const mockUser = mockUsers[0];

        test('should login user', async () => {
            const response = await request(app).post('/auth/login').send({
                email: mockUser.email,
                password: mockUser.password,
            });

            expect(response.statusCode).toBe(200);
            expect(response.headers['set-cookie']).toBeDefined();
        });

        test('should respond with 400 because of missing email', async () => {
            const response = await request(app).post('/auth/login').send({
                password: mockUser.password,
            });

            expect(response.statusCode).toBe(400);
        });

        test('should respond with 400 because of missing password', async () => {
            const response = await request(app).post('/auth/login').send({
                email: mockUser.email,
            });

            expect(response.statusCode).toBe(400);
        });

        test('should respond with 403 because of invalid password', async () => {
            const response = await request(app).post('/auth/login').send({
                email: mockUser.email,
                password: 'invalid-password',
            });

            expect(response.statusCode).toBe(403);
        });

        test('should respond with 403 because of non existing email', async () => {
            const mockUser = mockUsers[0];

            const response = await request(app).post('/auth/login').send({
                email: 'invalid-email@mail.example',
                password: mockUser.password,
            });

            expect(response.statusCode).toBe(403);
        });
    });

    describe('POST /auth/logout', () => {
        test('should logout user', async () => {
            const mockUser = mockUsers[0];
            const loginResponse = await request(app).post('/auth/login').send({
                email: mockUser.email,
                password: mockUser.password,
            });

            const cookies = loginResponse.headers['set-cookie'];

            const response = await request(app)
                .post('/auth/logout')
                .set('Cookie', cookies);

            expect(response.statusCode).toBe(200);
        });
    });
});

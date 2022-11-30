import request from 'supertest';
import app from '../../app';
import { clearDB, mockedList, seedDB } from './utils';

beforeAll(clearDB);

describe('/lists', () => {
    describe('GET /lists', () => {
        test('should get all lists', async () => {
            const response = await request(app).get('/lists');

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });

    describe('GET /lists/:id', () => {
        beforeAll(seedDB);
        afterAll(clearDB);

        test('should get one list with an id', async () => {
            const response = await request(app).get(`/lists/${mockedList.id}`);

            expect(response.statusCode).toBe(200);

            expect(response.body).toHaveProperty('name');
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('items');

            expect(response.body.name).toBe(mockedList.name);
            expect(response.body.id).toBe(mockedList.id);
            expect(mockedList.items).toMatchObject(response.body.items);
        });

        test('should respond with 404 because of non existing id', async () => {
            const response = await request(app).get('/lists/non-existing-id');

            expect(response.statusCode).toBe(404);
        });
    });

    describe('POST /lists', () => {
        test('should create one list', async () => {
            const name = 'List name';

            const response = await request(app).post('/lists').send({ name });

            expect(response.statusCode).toBe(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('name');
            expect(response.body).toHaveProperty('items');

            expect(typeof response.body.id).toBe('string');
            expect(response.body.name).toBe(name);
            expect(response.body.items).toEqual([]);
        });

        test('should respond with 404 because of name property missing', async () => {
            const response = await request(app).post('/lists').send();

            expect(response.statusCode).toBe(400);
        });

        test('should respond with 404 because of wrong name property type', async () => {
            const response = await request(app)
                .post('/lists')
                .send({ name: 1 });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('PUT /lists/:id', () => {
        beforeAll(seedDB);
        afterAll(clearDB);

        test('should update list id', async () => {
            const name = 'Updated name';

            const response = await request(app).put('/lists/1').send({ name });

            expect(response.body.name).toBe(name);
        });

        test('should throw if id does not exist', async () => {
            const name = 'Updated name';

            const response = await request(app)
                .put('/lists/non-existing')
                .send({ name });

            expect(response.statusCode).toBe(404);
        });

        test('should throw if name is an empty string', async () => {
            const response = await request(app)
                .put('/lists/1')
                .send({ name: '' });

            expect(response.statusCode).toBe(400);
        });

        test('should throw if name is wring type', async () => {
            const response = await request(app)
                .put('/lists/1')
                .send({ name: 1 });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('DELETE lists/:id', () => {
        beforeEach(seedDB);
        afterEach(clearDB);

        test('should delete list and all its items', async () => {
            const response = await request(app).delete('/lists/1');

            expect(response.statusCode).toBe(200);

            const response2 = await request(app).get('/lists/1');

            expect(response2.statusCode).toBe(404);

            const response3 = await request(app).get('/items?listId=1');

            expect(response3.body).toEqual([]);
        });

        test('should respond with 404 because of wrong id', async () => {
            const response = await request(app).delete(
                '/lists/non-existing-id'
            );

            expect(response.statusCode).toBe(404);
        });
    });
});

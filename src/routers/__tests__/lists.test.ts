import request from 'supertest';
import app from '../../app';
import { mockLists, mockAllTodoItems } from '../../__tests__/mocks';

const mockList = mockLists[0];
const mockListId = mockList.id;
const mockItems = mockAllTodoItems.filter(
    (item) => item.listId === mockList.id
);

describe('/lists', () => {
    describe('GET /lists', () => {
        test('should get all lists', async () => {
            const response = await request(app).get('/lists');

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });

    describe('GET /lists/:id', () => {
        test('should get one list with an id', async () => {
            const response = await request(app).get(`/lists/${mockList.id}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe(mockLists[0].name);
            expect(response.body.id).toBe(mockList.id);
            expect(mockItems).toMatchObject(response.body.items);
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
            expect(typeof response.body.id).toBe('string');
            expect(response.body.name).toBe(name);
            expect(response.body.items).toEqual([]);
        });

        test('should respond with 400 because of name property missing', async () => {
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
        test('should update list name', async () => {
            const name = 'Updated name';

            const response = await request(app)
                .put(`/lists/${mockListId}`)
                .send({ name });

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
                .put(`/lists/${mockListId}`)
                .send({ name: '' });

            expect(response.statusCode).toBe(400);
        });

        test('should throw if name is wrong type', async () => {
            const response = await request(app)
                .put(`/lists/${mockListId}`)
                .send({ name: 1 });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('DELETE lists/:id', () => {
        test('should delete list and all its items', async () => {
            const deleteResponse = await request(app).delete(
                `/lists/${mockListId}`
            );

            expect(deleteResponse.statusCode).toBe(200);

            const getListResponse = await request(app).get(
                `/lists/${mockListId}`
            );

            expect(getListResponse.statusCode).toBe(404);

            const getItemsResponse = await request(app).get(
                `/items?listId=${mockListId}`
            );

            expect(getItemsResponse.body).toEqual([]);
        });

        test('should respond with 404 because of non existing id', async () => {
            const response = await request(app).delete(
                '/lists/non-existing-id'
            );

            expect(response.statusCode).toBe(404);
        });
    });
});

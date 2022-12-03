import request from 'supertest';
import app from '../../app';
import { TodoList, TodoListItem } from '@prisma/client';
import { mockTodoItems } from '../../__tests__/mocks';

type ListWithItems = {
    items: TodoListItem[];
} & TodoList;

describe('/items', () => {
    describe('POST /items', () => {
        test('should create one item', async () => {
            const description = 'Item name';
            const listId = '2';

            const response = await request(app)
                .post('/items')
                .send({ description, listId });

            expect(response.statusCode).toBe(201);

            expect(typeof response.body.id).toBe('string');
            expect(response.body.description).toBe(description);
            expect(response.body.completed).toBe(false);
        });

        test('should respond with 404 because of wrong list id', async () => {
            const response = await request(app)
                .post('/items')
                .send({ listId: 'Wrong id', description: 'Should fail' });

            expect(response.statusCode).toBe(404);
        });

        test('should respond with 400 because of listId missing', async () => {
            const response = await request(app)
                .post('/items')
                .send({ description: 'Some description' });

            expect(response.statusCode).toBe(400);
        });

        test('should respond with 400 because of description missing', async () => {
            const response = await request(app)
                .post('/items')
                .send({ listId: '2' });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('PUT /items', () => {
        test('should update item description', async () => {
            const id = mockTodoItems[0].id;
            const description = 'Updated description';

            const response = await request(app)
                .put(`/items/${id}`)
                .send({ description });

            expect(response.statusCode).toBe(200);

            expect(response.body.description).toBe(description);

            // rollback
            await request(app)
                .put(`/items/${id}`)
                .send({ description: mockTodoItems[0].description });
        });

        test('should update item completed state', async () => {
            const id = mockTodoItems[0].id;
            const completed = !mockTodoItems[0].completed;

            const response = await request(app)
                .put(`/items/${id}`)
                .send({ completed });

            expect(response.statusCode).toBe(200);

            expect(response.body.completed).toBe(completed);

            // rollback
            await request(app)
                .put(`/items/${id}`)
                .send({ completed: mockTodoItems[0].completed });
        });

        test('should respond with 404 because of wrong item id', async () => {
            const response = await request(app)
                .put('/items/wrong-id')
                .send({ description: 'Should fail' });

            expect(response.statusCode).toBe(404);
        });

        test('should respond with 404 because of wrong description property type', async () => {
            const response = await request(app)
                .put('/items/1')
                .send({ description: false });

            expect(response.statusCode).toBe(400);
        });

        test('should throw if description is an empty string', async () => {
            const response = await request(app)
                .put('/items/1')
                .send({ description: '' });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('DELETE items/:id', () => {
        test('should delete item', async () => {
            const listId = '1';

            const postItemResponse = await request(app)
                .post('/items')
                .send({ description: 'New item', listId });

            const itemId = postItemResponse.body.id;

            const response = await request(app).delete(`/items/${itemId}`);

            expect(response.statusCode).toBe(200);

            const response2 = await request(app).get(`/lists/${listId}`);

            expect(
                (response2.body as ListWithItems).items.some(
                    ({ id }) => id === itemId
                )
            ).toBeFalsy();
        });

        test('should respond with 404 because of wrong id', async () => {
            const response = await request(app).delete('/items/6');

            expect(response.statusCode).toBe(404);
        });
    });
});

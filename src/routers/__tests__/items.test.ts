import request from 'supertest';
import app from '../../app';
import { TodoList, TodoListItem } from '@prisma/client';
import { mockAllTodoItems, mockLists } from '../../__tests__/mocks';

type ListWithItems = {
    items: TodoListItem[];
} & TodoList;

const mockList = mockLists[1];
const mockListId = mockList.id;
const mockItems = mockAllTodoItems.filter(
    (item) => item.listId === mockList.id
);
const mockFirstItem = mockItems[0];

describe('/items', () => {
    describe('POST /items', () => {
        test('should create one item', async () => {
            const description = 'Item name';

            const response = await request(app)
                .post('/items')
                .send({ description, listId: mockListId });

            expect(response.statusCode).toBe(201);

            expect(typeof response.body.id).toBe('string');
            expect(response.body.description).toBe(description);
            expect(response.body.completed).toBe(false);
        });

        test('should respond with 404 because of non existing list id', async () => {
            const response = await request(app)
                .post('/items')
                .send({
                    listId: 'non-existing-list-id',
                    description: 'Should fail',
                });

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
                .send({ listId: mockListId });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('PUT /items', () => {
        test('should update item description', async () => {
            const description = 'Updated description';

            const response = await request(app)
                .put(`/items/${mockFirstItem.id}`)
                .send({ description });

            expect(response.statusCode).toBe(200);

            expect(response.body.description).toBe(description);
        });

        test('should update item completed state', async () => {
            const completed = !mockFirstItem.completed;

            const response = await request(app)
                .put(`/items/${mockFirstItem.id}`)
                .send({ completed });

            expect(response.statusCode).toBe(200);

            expect(response.body.completed).toBe(completed);
        });

        test('should respond with 404 because of non existing item id', async () => {
            const response = await request(app)
                .put('/items/non-existing-id')
                .send({ description: 'Should fail' });

            expect(response.statusCode).toBe(404);
        });

        test('should respond with 404 because of wrong description property type', async () => {
            const response = await request(app)
                .put(`/items/${mockFirstItem.id}`)
                .send({ description: false });

            expect(response.statusCode).toBe(400);
        });

        test('should throw if description is an empty string', async () => {
            const response = await request(app)
                .put(`/items/${mockFirstItem.id}`)
                .send({ description: '' });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('PUT /items/reorder', () => {
        const mockList = mockLists[2];
        const mockListId = mockList.id;
        const mockItems = mockAllTodoItems.filter(
            (item) => item.listId === mockListId
        );
        const mockItemIds = mockItems.map((item) => item.id);

        test('should reorder items', async () => {
            const reorderedItemIds = [
                mockItemIds[0],
                mockItemIds[1],
                mockItemIds[2],
                mockItemIds[4],
                mockItemIds[3],
            ];

            const response = await request(app)
                .put(`/items/reorder?listId=${mockListId}`)
                .send(reorderedItemIds);

            expect(response.statusCode).toBe(200);
            expect(
                (response.body as TodoListItem[]).map((item) => item.id)
            ).toEqual(reorderedItemIds);
        });

        test('should respond with 404 because of non existing list id', async () => {
            const response = await request(app)
                .put('/items/reorder?listId=non-existing-list-id')
                .send([]);

            expect(response.statusCode).toBe(404);
        });

        test('should respond with 400 because of listId missing', async () => {
            const response = await request(app).put('/items/reorder').send([]);

            expect(response.statusCode).toBe(400);
        });

        test('should respond with 400 because of items are not equal', async () => {
            const reorderedItemIds = [...mockItemIds, 'non-existing-id'];

            const response = await request(app)
                .put(`/items/reorder?listId=${mockListId}`)
                .send(reorderedItemIds);

            expect(response.statusCode).toBe(400);
        });
    });

    describe('DELETE items/:id', () => {
        test('should delete item', async () => {
            const response = await request(app).delete(
                `/items/${mockFirstItem.id}`
            );

            expect(response.statusCode).toBe(200);

            const response2 = await request(app).get(`/lists/${mockListId}`);

            expect(
                (response2.body as ListWithItems).items.some(
                    ({ id }) => id === mockFirstItem.id
                )
            ).toBeFalsy();
        });

        test('should respond with 404 because of non existing id', async () => {
            const response = await request(app).delete(
                '/items/non-existing-id'
            );

            expect(response.statusCode).toBe(404);
        });
    });
});

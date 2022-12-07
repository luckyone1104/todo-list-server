import { Decimal } from '@prisma/client/runtime';

export const mockUsers = [
    {
        id: '1',
        name: 'User 1',
        email: 'user1@mail.mock',
        password: 'mock-password',
    },
    {
        id: '2',
        name: 'User 2',
        email: 'user2@mail.mock',
        password: 'mock-password',
    },
];

export const mockLists = [
    // used in list tests
    {
        id: '1',
        name: 'List #1',
    },
    // used in item tests
    {
        id: '2',
        name: 'List #2',
    },
    // used in item reordering tests
    {
        id: '3',
        name: 'List #3',
    },
    {
        id: '4',
        name: 'List #4',
        userId: mockUsers[0].id,
    },
    {
        id: '5',
        name: 'List #5',
        userId: mockUsers[1].id,
    },
];

export const mockAllTodoItems = [
    {
        id: '1',
        description: 'Item #1',
        completed: false,
        position: new Decimal(1),
        listId: '1',
    },
    {
        id: '2',
        description: 'Item #2',
        completed: false,
        position: new Decimal(2),
        listId: '1',
    },
    {
        id: '3',
        description: 'Item #3',
        completed: false,
        position: new Decimal(3),
        listId: '1',
    },
    {
        id: '4',
        description: 'Item #4',
        completed: false,
        position: new Decimal(4),
        listId: '1',
    },
    {
        id: '5',
        description: 'Item #5',
        completed: false,
        position: new Decimal(5),
        listId: '1',
    },
    {
        id: '6',
        description: 'Item #6',
        completed: false,
        position: new Decimal(6),
        listId: '2',
    },
    {
        id: '7',
        description: 'Item #7',
        completed: false,
        position: new Decimal(7),
        listId: '3',
    },
    {
        id: '8',
        description: 'Item #8',
        completed: false,
        position: new Decimal(8),
        listId: '3',
    },
    {
        id: '9',
        description: 'Item #9',
        completed: false,
        position: new Decimal(9),
        listId: '3',
    },
    {
        id: '10',
        description: 'Item #10',
        completed: false,
        position: new Decimal(10),
        listId: '3',
    },
    {
        id: '11',
        description: 'Item #11',
        completed: false,
        position: new Decimal(11),
        listId: '3',
    },
];

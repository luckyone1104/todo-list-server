import { Decimal } from '@prisma/client/runtime';

export const mockLists = [
    {
        id: '1',
        name: 'List #1',
    },
    {
        id: '2',
        name: 'List #2',
    },
];

export const mockTodoItems = [
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
];

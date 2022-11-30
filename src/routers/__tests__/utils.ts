import { Decimal } from '@prisma/client/runtime';
import { prisma } from '../../db';

export const mockedTodoItems = [
    {
        id: '1',
        description: 'Item #1',
        completed: false,
        position: new Decimal(1),
    },
    {
        id: '2',
        description: 'Item #2',
        completed: false,
        position: new Decimal(2),
    },
    {
        id: '3',
        description: 'Item #3',
        completed: false,
        position: new Decimal(3),
    },
    {
        id: '4',
        description: 'Item #4',
        completed: false,
        position: new Decimal(4),
    },
    {
        id: '5',
        description: 'Item #5',
        completed: false,
        position: new Decimal(5),
    },
];

export const mockedList = {
    id: '1',
    name: 'List #1',
    items: mockedTodoItems,
};

export const seedDB = async () => {
    await prisma.todoList.create({
        data: {
            ...mockedList,
            items: {
                createMany: {
                    data: mockedTodoItems,
                },
            },
        },
    });
};

export const clearDB = async () => {
    try {
        await prisma.$executeRaw`DELETE FROM TodoList;`;
        await prisma.$executeRaw`DELETE FROM TodoListItem;`;
    } catch (e) {
        console.error(e);
    }
};

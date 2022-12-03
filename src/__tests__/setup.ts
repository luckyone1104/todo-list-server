const { prisma } = require('../db');
const { mockLists, mockTodoItems } = require('./mocks');

const clearDB = async () => {
    try {
        await prisma.$executeRaw`DELETE FROM TodoList;`;
        await prisma.$executeRaw`DELETE FROM TodoListItem;`;
    } catch (e) {
        console.error(e);
    }
};

const seedDB = async () => {
    await prisma.todoList.createMany({
        data: mockLists,
    });

    await prisma.todoListItem.createMany({
        data: mockTodoItems,
    });
};

module.exports = async () => {
    await clearDB();
    await seedDB();
};

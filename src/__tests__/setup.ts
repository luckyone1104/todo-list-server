import { Prisma } from '@prisma/client';
import { hashPassword } from '../services/password';
import { prisma } from '../db';
import { mockLists, mockUsers, mockAllTodoItems } from './mocks';

const clearDB = async () => {
    const tableNames = Object.keys(Prisma.ModelName);

    const promises = tableNames.map((name) =>
        prisma.$queryRawUnsafe(`DELETE FROM ${name};`)
    );

    await Promise.all(promises);
};

const seedDB = async () => {
    const mockUsersWithHashedPasswords = await Promise.all(
        mockUsers.map(async (user) => ({
            ...user,
            password: await hashPassword(user.password),
        }))
    );

    await prisma.user.createMany({
        data: mockUsersWithHashedPasswords,
    });

    await prisma.todoList.createMany({
        data: mockLists,
    });

    await prisma.todoListItem.createMany({
        data: mockAllTodoItems,
    });
};

const setup = async () => {
    await clearDB();
    await seedDB();
};

export default setup;

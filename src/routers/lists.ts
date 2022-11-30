import express from 'express';
import { prisma } from '../db';
import { z } from 'zod';

const router = express.Router();

const WRONG_ID_ERROR_MESSAGE = 'List with such id does not exist';

router.get('/', async (req, res, next) => {
    try {
        const lists = await prisma.todoList.findMany();

        res.status(200).json(lists);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        z.string().parse(req.params.id);

        const list = await prisma.todoList.findFirst({
            where: {
                id: req.params.id,
            },
            include: {
                items: {
                    select: {
                        id: true,
                        description: true,
                        completed: true,
                    },
                },
            },
        });

        if (!list) {
            res.status(404).json({
                error: WRONG_ID_ERROR_MESSAGE,
            });
        }

        res.status(200).json(list);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        z.object({
            name: z.string(),
        }).parse(req.body);

        const list = await prisma.todoList.create({
            data: {
                name: req.body.name,
            },
            include: {
                items: true,
            },
        });

        res.status(201).json(list);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        z.string().parse(req.params.id);
        z.object({
            name: z.string().min(1),
        }).parse(req.body);

        const exists = !!(await prisma.todoList.findFirst({
            where: { id: req.params.id },
        }));

        if (!exists) {
            res.status(404).json({
                error: WRONG_ID_ERROR_MESSAGE,
            });
        }

        const list = await prisma.todoList.update({
            data: {
                name: req.body.name,
            },
            where: {
                id: req.params?.id,
            },
        });

        res.status(200).json(list);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        z.string().parse(req.params.id);

        const listId = req.params.id;

        const exists = !!(await prisma.todoList.findFirst({
            where: { id: listId },
        }));

        if (!exists) {
            res.status(404).json({
                error: WRONG_ID_ERROR_MESSAGE,
            });
        }

        const todoListItemsIds = await prisma.todoListItem.findMany({
            select: {
                id: true,
            },
            where: {
                listId,
            },
        });
        await Promise.all(
            todoListItemsIds.map(({ id }) =>
                prisma.todoListItem.delete({ where: { id } })
            )
        );

        const list = await prisma.todoList.delete({
            where: {
                id: listId,
            },
        });

        res.status(200).json(list);
    } catch (error) {
        next(error);
    }
});

export default router;

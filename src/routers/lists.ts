import express from 'express';
import { prisma } from '../db';
import { body, validationResult } from 'express-validator';

const router = express.Router();

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
        const list = await prisma.todoList.findFirst({
            where: {
               id: req.params.id
            }
        });

        if (!list) {
            res.status(404);
        }

        res.status(200).json(list);
    } catch (error) {
        next(error);
    }
});

router.post(
    '/',
    body('name').isString(),
    body(['id', 'items']).not().exists(),
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const list = await prisma.todoList.create({
                data: req.body,
                include: {
                    items: true,
                },
            });

            res.status(201).json(list);
        } catch (error) {
            next(error);
        }
    }
);

router.put(
    '/:id',
    body('name').isString(),
    body(['id', 'items']).not().exists(),
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const list = await prisma.todoList.update({
                data: req.body,
                where: {
                    id: req.params?.id,
                },
            });

            res.status(200).json(list);
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:id', async (req, res, next) => {
    try {
        const listId = req.params?.id;
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

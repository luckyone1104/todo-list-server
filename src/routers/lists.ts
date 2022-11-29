import express from 'express';
import {prisma} from '../db';
import {z} from "zod";

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
        z.string().parse(req.params.id);

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
    async (req, res, next) => {
        try {
            z.object({
                name: z.string(),
            }).parse(req.body);

            const list = await prisma.todoList.create({
                data: {
                    name: req.body.name
                },
                include: {
                    items: true,
                },
            });

            res.status(201).json(list);
        } catch (error) {
            console.log('error', error)
            next(error);
        }
    }
);

router.put(
    '/:id',
    async (req, res, next) => {
        try {
            z.string().parse(req.params.id);
            z.object({
                name: z.string()
            }).parse(req.body);

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
    }
);

router.delete('/:id', async (req, res, next) => {
    try {
        z.string().parse(req.params.id);

        const listId = req.params.id;
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

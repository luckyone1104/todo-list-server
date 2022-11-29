import express from 'express';
import {prisma} from '../db';
import {z} from "zod";

const router = express.Router();

router.get(
    '/',
    async (req, res, next) => {
        try {
            const schema = z.object({
                listId: z.string()
            });

            schema.parse(req.query);

            const items = await prisma.todoListItem.findMany({
                select: {
                    id: true,
                  description: true,
                    completed: true,
                },
                where: {
                    listId: (req.query as z.infer<typeof schema>).listId
                },
            });

            res.status(200).json(items);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    '/',
    async (req, res, next) => {
        try {
           z.object({
                listId: z.string(),
                description: z.string(),
            }).parse(req.body);

            const item = await prisma.todoListItem.create({
                data: {
                    listId: req.body.listId,
                    description: req.body.listId,
                },
            });

            res.status(201).json(item);
        } catch (error) {

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
                description: z.string().optional(),
                completed: z.boolean().optional(),
            }).parse(req.body);

            const item = await prisma.todoListItem.update({
                data: {
                    description: req.body.description,
                    completed: req.body.completed,
                },
                where: {
                    id: req.params?.id,
                },
            });

            res.status(201).json(item);
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:id', async (req, res, next) => {
    try {
        const item = await prisma.todoListItem.delete({
            where: {
                id: req.params.id,
            },
        });

        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
});

export default router;

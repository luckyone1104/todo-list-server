import express from 'express';
import { prisma } from '../db';
import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime';
import {
    WRONG_ITEM_ID_ERROR_MESSAGE,
    WRONG_LIST_ID_ERROR_MESSAGE,
} from '../const';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const schema = z.object({
            listId: z.string(),
        });

        schema.parse(req.query);

        const items = await prisma.todoListItem.findMany({
            select: {
                id: true,
                description: true,
                completed: true,
                position: true,
            },
            where: {
                listId: (req.query as z.infer<typeof schema>).listId,
            },
            orderBy: {
                position: 'asc',
            },
        });

        res.status(200).json(items);
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        z.object({
            listId: z.string().min(1),
            description: z.string().min(1),
        }).parse(req.body);

        const listId = req.body.listId;

        const listExists = !!(await prisma.todoList.findFirst({
            where: { id: listId },
        }));

        if (!listExists) {
            res.status(404).send({
                error: WRONG_LIST_ID_ERROR_MESSAGE,
            });
        }

        const payload = await prisma.todoListItem.findFirst({
            select: {
                position: true,
            },
            orderBy: {
                position: 'desc',
            },
            where: {
                listId,
            },
        });

        const lastPosition = payload?.position || 0;
        const nextPosition = Math.ceil(lastPosition as number) + 1;

        const item = await prisma.todoListItem.create({
            select: {
                id: true,
                description: true,
                completed: true,
            },
            data: {
                listId,
                description: req.body.description,
                position: nextPosition,
            },
        });

        res.status(201).json(item);
    } catch (error) {
        next(error);
    }
});

router.put('/reorder', async (req, res, next) => {
    try {
        const querySchema = z.object({
            listId: z.string().min(1),
        });

        querySchema.parse(req.query);

        const bodySchema = z.array(
            z.object({
                id: z.string().min(1),
            })
        );

        bodySchema.parse(req.body);

        const listId = (req.query as z.infer<typeof querySchema>).listId;

        const prevItems = await prisma.todoListItem.findMany({
            select: {
                id: true,
                position: true,
            },
            where: {
                listId,
            },
            orderBy: {
                position: 'asc',
            },
        });

        const newItems = (req.body as z.infer<typeof bodySchema>).map(
            (newItem) => ({
                ...newItem,
                position: prevItems.find(
                    (prevItem) => prevItem.id === newItem.id
                )?.position as Decimal,
            })
        );

        if (prevItems.length !== newItems.length) {
            res.status(400).json({
                error: 'New items amount differs from the original',
            });
        }

        let idx = 0;
        while (
            (prevItems[idx].id === newItems[idx].id ||
                prevItems[idx].id === newItems[idx + 1].id) &&
            idx < prevItems.length
        ) {
            idx++;
        }

        let position: null | Decimal = null;

        const newIdx = newItems.indexOf(
            newItems.find((item) => item.id === prevItems[idx].id)!
        );

        if (newIdx > 1 && newIdx < prevItems.length - 1) {
            const prevPos = newItems[newIdx - 1].position;
            const nextPos = newItems[newIdx + 1].position;

            position = prevPos.add(nextPos).div(2);
        } else if (newIdx === 0) {
            position = newItems[newIdx + 1].position.div(2);
        } else if (newIdx === newItems.length - 1) {
            position = newItems[newIdx - 1].position.ceil().add(1);
        } else {
            res.status(500).json({
                message: 'Impossible position',
            });
        }

        await prisma.todoListItem.update({
            // @ts-ignore
            data: { position },
            where: { id: newItems[newIdx].id },
        });

        const items = await prisma.todoListItem.findMany({
            select: {
                id: true,
                description: true,
                completed: true,
                position: true,
            },
            where: {
                listId,
            },
            orderBy: {
                position: 'asc',
            },
        });

        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        z.string().min(1).parse(id);
        z.object({
            description: z.string().min(1).optional(),
            completed: z.boolean().optional(),
        }).parse(req.body);

        const exists = !!(await prisma.todoListItem.findFirst({
            where: { id },
        }));

        if (!exists) {
            res.status(404).json({
                error: WRONG_ITEM_ID_ERROR_MESSAGE,
            });
        }

        const item = await prisma.todoListItem.update({
            data: {
                description: req.body.description,
                completed: req.body.completed,
            },
            where: {
                id,
            },
        });

        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        const exists = !!(await prisma.todoListItem.findFirst({
            where: { id },
        }));

        if (!exists) {
            res.status(404).json({
                error: WRONG_ITEM_ID_ERROR_MESSAGE,
            });
        }

        const item = await prisma.todoListItem.delete({
            where: {
                id,
            },
        });

        res.status(200).json(item);
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
});

export default router;

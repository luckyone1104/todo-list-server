import express from 'express';
import { prisma } from '../db';
import { z } from 'zod';
import {
    WRONG_ITEM_ID_ERROR_MESSAGE,
    WRONG_LIST_ID_ERROR_MESSAGE,
} from '../const';
import {
    findMovedItemIndexes,
    getInsertedItemDecimalPosition,
    isEqualDespiteOrder,
} from '../services/items';

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

        const listId = (req.query as z.infer<typeof querySchema>).listId;

        const listExists = !!(await prisma.todoList.findFirst({
            where: { id: listId },
        }));

        if (!listExists) {
            res.status(404).send({
                error: WRONG_LIST_ID_ERROR_MESSAGE,
            });
        }

        const bodySchema = z.array(z.string().min(1));

        bodySchema.parse(req.body);

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

        const prevItemIds = prevItems.map((item) => item.id);
        const newItemIds = req.body as z.infer<typeof bodySchema>;

        const newItems = newItemIds.map(
            (id) => prevItems.find((item) => item.id === id)!
        );

        if (!isEqualDespiteOrder(prevItemIds, newItemIds)) {
            res.status(400).send({
                error: 'Previous and new items are not equal',
            });
        }

        const [, newIdx] = findMovedItemIndexes(prevItems, newItems);
        const position = getInsertedItemDecimalPosition(prevItems, newIdx);
        const itemToUpdate = newItems[newIdx];

        await prisma.todoListItem.update({
            data: { position },
            where: { id: itemToUpdate.id },
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

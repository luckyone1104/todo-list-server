import express from 'express';
import { prisma } from '../db';
import { body, query, validationResult } from 'express-validator';

const router = express.Router();

router.get(
    '/',
    query('listId').optional().isString(),
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const items = await prisma.todoListItem.findMany({
                select: {
                    id: true,
                  description: true,
                    completed: true,
                    listId: !req.query?.listId
                },
                where: req.query,
            });

            res.status(200).json(items);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    '/',
    body(['listId', 'description']).isString().notEmpty(),
    body('completed').optional().isBoolean(),
    body('id').not().exists(),
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const item = await prisma.todoListItem.create({
                data: req.body,
            });

            res.status(201).json(item);
        } catch (error) {
            next(error);
        }
    }
);

router.put(
    '/:id',
    body(`description`).optional().isString(),
    body('completed').optional().isBoolean(),
    body('listId').not().exists(),
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const item = await prisma.todoListItem.update({
                data: req.body,
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

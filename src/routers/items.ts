import express from "express";
import { prisma } from "../db";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        console.log(req.query);
        const items = await prisma.todoListItem.findMany({
            where: req.query
        });

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error })
    }
});

router.post('/', async (req, res) => {
    try {
        const item = await prisma.todoListItem.create({
            data: req.body,
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error })
    }
});

router.put('/:id', async (req, res) => {
    try {
        const item = await prisma.todoListItem.update({
            data: req.body,
            where: {
                id: req.params.id
            }
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const item = await prisma.todoList.delete({
            where: {
                id: req.params.id
            }
        });

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error })
    }
});

export default router;

import express from "express";
import { prisma } from "../db";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const lists = await prisma.todoList.findMany();

        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ error })
    }
});

router.post('/', async (req, res) => {
    try {
        const list = await prisma.todoList.create({
            data: req.body,
            include: {
                items: true
            }
        });

        res.status(201).json(list);
    } catch (error) {
        res.status(500).json({ error })
    }
});

router.put('/:id', async (req, res) => {
    try {
        const list = await prisma.todoList.update({
            data: req.body,
            where: {
                id: Number(req.params.id)
            }
        });

        res.status(201).json(list);
    } catch (error) {
        res.status(500).json({ error })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const list = await prisma.todoList.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ error })
    }
});

export default router;

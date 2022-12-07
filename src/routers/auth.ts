import express from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { INVALID_CREDENTIALS_ERROR_MESSAGE } from '../const';
import { comparePasswords, hashPassword } from '../services/password';

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        const schema = z.object({
            name: z.string().min(1),
            email: z.string().email(),
            password: z.string().min(8),
        });

        schema.parse(req.body);

        const { name, email, password } = req.body as z.infer<typeof schema>;

        const [duplicateUser, duplicateName] = await Promise.all([
            prisma.user.findFirst({
                where: {
                    email,
                },
            }),
            prisma.user.findFirst({
                where: {
                    name,
                },
            }),
        ]);

        if (duplicateUser) {
            res.status(400).json({
                error: 'User already exists',
            });
            return;
        }

        if (duplicateName) {
            res.status(400).json({
                error: 'Name already exists',
            });
            return;
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        req.session.userId = user.id;

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const schema = z.object({
            email: z.string().email(),
            password: z.string().min(8),
        });

        schema.parse(req.body);

        const { email, password } = req.body as z.infer<typeof schema>;

        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            res.status(403).json({
                error: INVALID_CREDENTIALS_ERROR_MESSAGE,
            });
            return;
        }

        const passwordMatches = await comparePasswords(password, user.password);

        if (!passwordMatches) {
            res.status(403).json({
                error: INVALID_CREDENTIALS_ERROR_MESSAGE,
            });
            return;
        }

        req.session.userId = user.id;

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

router.post('/logout', async (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) next(err);

            res.sendStatus(200);
        });
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
});

export default router;

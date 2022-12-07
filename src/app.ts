import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import lists from './routers/lists';
import items from './routers/items';
import auth from './routers/auth';
import { errorHandler } from './middleware/errorHandler';
import { prismaSessionStore } from './db';
import { isProd, ONE_WEEK } from './const';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: ONE_WEEK,
            httpOnly: true,
            secure: isProd,
        },
        store: prismaSessionStore,
    })
);

app.use('/lists', lists);
app.use('/items', items);
app.use('/auth', auth);
app.use(errorHandler);

export default app;

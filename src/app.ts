import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import lists from './routers/lists';
import items from './routers/items';
import { errorHandler } from './errorHandler';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/lists', lists);
app.use('/items', items);

app.use(errorHandler);

export default app;

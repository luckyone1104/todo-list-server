import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import lists from './routers/lists';
import items from './routers/items';

const server = express();
const port = process.env.PORT || 3001;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

server.use('/lists', lists);
server.use('/items', items);

server.listen(port, () => {
    console.log(`Server is listening at port: ${port}`);
});

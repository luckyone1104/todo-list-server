import express from 'express';
import bodyParser from "body-parser";
import lists from './routers/lists';

const server = express();
const port = process.env.PORT || 3001;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use('/lists', lists);

server.listen(port, () => {
    console.log(`Server is listening at port: ${port}`)
})

require('dotenv').config();
const ServerSocket = require('./server/server');


const server = new ServerSocket();


server.listen();
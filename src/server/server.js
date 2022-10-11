const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const {socketController} = require('../sockets/socket.controller')

class ServerSocket {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        // sockets
        this.httpServer = http.createServer( this.app );
        this.io = new Server(this.httpServer, {
            pingTimeout: 2000
        }); 

        this.middlewares();

        this.routes();

        this.socketsConfig();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Public directory
        this.app.use(express.static(__dirname+'/../public'));

        // Read and parse body
        this.app.use(express.json())
    }

    routes() {
        this.app.use('/api/examples', require('../routes/examples.routes'));
    }

    socketsConfig() {
        this.io.on('connection', socketController);
    }

    listen() {
        this.httpServer.listen(this.port, () => {
            console.log('Server running at port: ', this.port);
        });
    }
}

module.exports = ServerSocket;
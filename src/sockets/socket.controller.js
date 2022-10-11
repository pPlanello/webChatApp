const { validSocketJWT } = require("../utils/valid-socket-jwt");

const socketController = async (socket) => {

    const token = socket.handshake.headers['x-token'];

    validSocketJWT(token)
        .then(user => {
            if (!user) {
                return socket.disconnect();
            }
        
            console.log(`Client ${user.username} with socket id = ${socket.id}`)
        });


    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id );
    });
}


module.exports = {
    socketController
}


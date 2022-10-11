const ChatMessages = require("../models/chatMessages");
const { validSocketJWT } = require("../utils/valid-socket-jwt");

const chatMessages = new ChatMessages();

const socketController = async (socket, io) => {

    const token = socket.handshake.headers['x-token'];

    const user = await validSocketJWT(token);
        
    if (!user) {
        return socket.disconnect();
    }

    console.log(`Connect client '${user.username}' with socket id = ${socket.id}`);
    
    // Add user
    chatMessages.connectUser(user);
    io.emit('active-users', chatMessages.usersList);
        
    socket.on('disconnect', () => {
        console.log(`Disconnect client '${user.username}' with socket id = ${socket.id}`);
        io.emit('active-users', chatMessages.usersList);
    });
}


module.exports = {
    socketController
}


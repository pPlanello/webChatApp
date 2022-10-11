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
    io.emit('received-messages', chatMessages.last10Messages);
    
    // Connect to private room
    socket.join(user.id); // global, socket.id, user.id
    
    // Send message to all
    socket.on('send-message', (payload) => {
        const {message, uid} = payload;

        if (uid) {
            // Private message
            io.to(uid).emit('private-message-user', {from: user.username, message});
        } else {
            // Global message
            chatMessages.sendMessage(user.id, user.username, message);
            io.emit('received-messages', chatMessages.last10Messages);
        }
    });



    // Disconnect
    socket.on('disconnect', () => {
        console.log(`Disconnect client '${user.username}' with socket id = ${socket.id}`);
        io.emit('active-users', chatMessages.usersList);
    });
}


module.exports = {
    socketController
}


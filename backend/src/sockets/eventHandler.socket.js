module.exports = (io, socket) => {

    socket.on('join_user_room', (userId) => {
        socket.join(userId);
        console.log(`user ${userId} joined room.`);

    });
    socket.on('send_invite', (data) => {
        socket.to(data.receiver).emit('receive_invite',data)
    });

} 
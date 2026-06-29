const Invitation = require('../models/invitation.modle');

module.exports = (io, socket) => {

    socket.on('join_user_room', (userId) => {
        socket.join(userId);
        console.log(`user ${userId} joined room.`);
    });

    socket.on('send_invite', async (data) => {

        const existingInvitations = await Invitation.findOne({
            $or: [
                { sender: data.sender, receiver: data.receiver },
                { sender: data.receiver, receiver: data.sender }
            ]
        })

        if (existingInvitations) {
            return io.to(data.sender).emit('sending_invite_failed', 'Invite already exist');
        }

        const newInvitation = new Invitation({
            sender: data.sender,
            receiver: data.receiver
        });

        await newInvitation.save();
        await newInvitation.populate('sender receiver');
        io.to(data.receiver).emit('receive_invite', newInvitation);
        io.to(data.sender).emit('invite_sent', newInvitation);

    })

    socket.on('cancel_invite', async (data) => {
        const canceledInvite = await Invitation.findByIdAndDelete(data._id).populate('sender receiver');
        io.to(data.sender._id).emit('invite_canceled', canceledInvite);
        io.to(data.receiver._id).emit('invite_canceled_by_sender', canceledInvite);

    })


}
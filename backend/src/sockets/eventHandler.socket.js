const Invitation = require('../models/invitation.modle');

module.exports = (io, socket) => {

    socket.on('join_user_room', (userId) => {
        socket.join(userId);
        console.log(`user ${userId} joined room.`);

    });
    socket.on('send_invite', async (data) => {
        try {
            const { sender, receiver } = data;

            // 1. Pehle check karo invitation pehle se hai ya nahi
            const existingInvitation = await Invitation.findOne({
                $or: [
                    { sender: sender, receiver: receiver },
                    { sender: receiver, receiver: sender }
                ]
            });

            // 2. Agar pehle se hai, toh yahin se RETURN kar jao
            if (existingInvitation) {
                console.log('Invitation already exists!');
                // Direct socket.emit use karein taaki isi bande ko message miley
                return socket.emit('invite_error', 'Invite already sent');
            }

            // 3. Agar nahi hai, toh hi code yahan tak pahuchega aur naya banayega
            const newInvitation = new Invitation({ sender, receiver });
            await newInvitation.save();
            await newInvitation.populate('sender receiver');

            console.log(newInvitation);

            // Receiver ko bheinjein
            socket.to(receiver).emit('receive_invite', newInvitation);

            // Sender ko success message bheinjein
            socket.emit('send_invite_success', newInvitation);

        } catch (error) {
            console.error("Error sending invite:", error);
            socket.emit('invite_error', 'Something went wrong');
        }
    });

    socket.on('cancel_invite', async (invite) => {
        console.log('invite cancel kia gya hy')
        const deletedInvite = await Invitation.findOneAndDelete({
            sender: invite.sender._id,
            receiver: invite.receiver._id
        })
        socket.to(invite.receiver._id).emit('invite_canceled', invite)

    })
    socket.on('reject_invite', async (invite) => {
        const rejectedInvite = await Invitation.findOneAndUpdate(
            {
                receiver: invite.receiver._id,
                sender: invite.sender._id,
                status: 'pending'
            },
            {
                $set: { status: 'rejected' }
            },
            { new: true }
        )

        socket.to(invite.sender._id).emit('invite_rejected', invite);
    })

} 
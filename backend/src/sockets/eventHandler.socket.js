const Invitation = require('../models/invitation.modle');
const Chat = require('../models/chat.model');
const Message = require('../models/message.model');

module.exports = (io, socket) => {

    socket.on('join_user_room', async (userId) => {
        socket.join(userId);

        const userChats = await Chat.find({ participants: userId });
        if (userChats.length > 0) {
            userChats.forEach(chat => {
                socket.join(chat.chatId);
            })
        }
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

    socket.on('accept_invite', async (data) => {
        const acceptedInvite = await Invitation.findByIdAndUpdate(
            data._id,
            { status: 'accepted' },
            { returnDocument: 'after' }
        ).populate('sender receiver');
        const sortedIds = [data.sender._id.toString(), data.receiver._id.toString()].sort()
        const chatId = `${sortedIds[0]}_${sortedIds[1]}`;
        const existingChat = await Chat.findOne({ chatId });
        if (!existingChat) {
            const newChat = await Chat({
                chatId,
                participants: [data.sender._id, data.receiver._id]
            });
            await newChat.save();
        }
        socket.join(chatId);
        io.to(data.sender._id.toString()).emit('invite_accepted', acceptedInvite)

    })

    socket.on('join_room', (data) => {
        socket.join(data.chatId);
    })

    socket.on('reject_invite', async (data) => {
        const rejectedInvite = await Invitation.findByIdAndUpdate(
            data._id,
            { status: 'rejected' },
            { returnDocument: 'after' }
        ).populate('sender receiver');
        io.to(data.sender._id.toString()).emit('invite_rejected', rejectedInvite);
    })

    socket.on('start_chat_with', async (data) => {
        const messages = await Message.find({ chatId: data.chatId }).populate('sender');
        console.log(messages);
        socket.emit('previous_messages', messages);
    })

    socket.on('send_message', async (data) => {
        const newMessage = await Message.create(data);
        newMessage.save();
        console.log(newMessage);
        io.to(data.chatId).emit('receive_message', data);
    })


}
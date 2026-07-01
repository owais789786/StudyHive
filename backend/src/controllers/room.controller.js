const Room = require('../models/room.model');
const Chat = require('../models/chat.model');

const createRoom = async (req, res) => {

    const { roomName, roomPassword, maxMembers, roomTags, members, description } = req.body;
    const user = req.user;

    try {
        const newRoom = await Room.create({
            roomName, roomPassword, maxMembers, roomTags, members, desc: description
        });

        return res.status(201).json({
            message: 'Room created successfully',
            success: true,
            data: {
                roomId: newRoom._id,
                adminId: user._id
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Failed to create room',
            success: false
        })
    }


}

const getAllRooms = async (req, res) => {
    try {

        const rooms = await Room.find();
        res.status(200).json({
            success: true,
            message: 'Fetched all rooms',
            rooms
        })
        return;

    } catch (error) {
        console.log(error.stack);
        res.status(500).json({
            success: false,
            message: error.message
        })

    }

}

const getAllChats = async (req, res) => {
    try {
        const userId = req.params.userId;
        const allChats = await Chat.find({ participants: userId }).populate('participants').lean();
        const filteredChats = allChats.map(chat => {
            const otherUserArray = chat.participants.filter(prev => prev._id.toString() !== userId.toString())
            return {
                ...chat,
                participants: otherUserArray[0] || null
            }
        })
        console.log(filteredChats);
        return res.status(200).json({
            message: 'Fetched all chats',
            success: true,
            data: filteredChats
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        })
    }
}

module.exports = { createRoom, getAllChats }
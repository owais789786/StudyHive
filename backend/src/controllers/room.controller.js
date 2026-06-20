const Room = require('../models/room.model');

const createRoom = async (req, res) => {
    console.log(req.body);
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

module.exports = { createRoom }
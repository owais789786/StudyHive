const User = require('../models/user.model');
const Invitation = require('../models/invitation.modle');

const getAllUsers = async (req, res) => {
    const loggedInUserId = req.decodedData.id;
    console.log("Logged In User ID:", loggedInUserId);

    try {
        // Step 1: Woh saare invitations dhoondo jahan loggedInUser sender ya receiver ho
        const existingInvitations = await Invitation.find({
            $or: [
                { sender: loggedInUserId },
                { receiver: loggedInUserId }
            ]
        });

        // Step 2: Un invitations se doosre users ki IDs nikal kar ek array banao
        const excludedUserIds = [loggedInUserId]; // Pehle se hi loggedInUser ko list mein daal diya

        existingInvitations.forEach(invite => {
            // Agar mein sender hoon, toh receiver ko exclude karo
            if (invite.sender.toString() === loggedInUserId) {
                excludedUserIds.push(invite.receiver);
            }
            // Agar mein receiver hoon, toh sender ko exclude karo
            else if (invite.receiver.toString() === loggedInUserId) {
                excludedUserIds.push(invite.sender);
            }
        });

        await Invitation.populate(existingInvitations, { path: 'sender receiver' });

        // Step 3: User query mein $nin use karo taaki excludedUserIds wala koi bhi banda na aaye
        const allUsers = await User.find({
            _id: { $nin: excludedUserIds }
        }).select('name _id');

        console.log('Filtered users fetched successfully');

        return res.status(200).json({
            message: 'Fetched all users except self and connected/invited users',
            success: true,
            data: { allUsers, invites: existingInvitations }
        });

    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
}

const invitationSender = async (req, res) => {
    try {
        console.log(req.body)
        const { sender, receiver } = req.body;
        const isSenderExist = await User.findById(sender);
        const isReceiverExist = await User.findById(receiver);

        if (!isSenderExist || !isReceiverExist) {
            console.log('1')
            return res.status(400).json({
                message: 'Invalid request',
                success: false
            })
        }

        if (sender == receiver) {
            console.log('2')
            return res.status(400).json({
                message: "You can't invite yourself",
                success: false
            })
        }

        const existingInvitation = await Invitation.findOne({
            $or: [
                { sender: sender, receiver: receiver },
                { sender: receiver, receiver: sender }
            ]
        });

        if (existingInvitation) {
            console.log(existingInvitation)
            console.log('3')
            return res.status(400).json({
                message: 'An invitation between these users already exists or is pending.',
                success: false
            })
        }

        const createdInvitation = await Invitation.create({
            sender,
            receiver
        });
        const newInvitation = {
            _id: createdInvitation._id,
            sender: createdInvitation.sender,
            receiver: createdInvitation.receiver
        }
        return res.status(201).json({
            message: 'Invite sent',
            success: true,
            data: newInvitation
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        })
    }
}

const invitationAcceptor = async (req, res) => {
    try {
        const { sender, receiver, status } = req.body;
        const isSenderExist = await User.findById(sender);
        const isReceiverExist = await User.findById(receiver);

        if (!isSenderExist || !isReceiverExist) {
            return res.status(400).json({
                message: 'Invalid request',
                success: false
            })
        }

        if (sender == receiver) {
            return res.status(400).json({
                message: "You can't invite yourself",
                success: false
            })
        }

        const existingInvitation = await Invitation.findOne({
            $or: [
                { sender: sender, receiver: receiver },
                { sender: receiver, receiver: sender }
            ]
        });

        if (!existingInvitation) {
            return res.status(400).json({
                message: 'Invite not exist',
                success: false
            })
        }

        existingInvitation.status = status;
        await existingInvitation.save();

        return res.status(201).json({
            message: 'Invite sent',
            success: true,
            data: existingInvitation
        })
    } catch (error) {
        console.log("invitation :", error)
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        })
    }
}

module.exports = { getAllUsers, invitationAcceptor, invitationSender }
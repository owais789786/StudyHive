const User = require('../models/user.model');
const Invitation = require('../models/invitation.modle');


const getAllUsers = async (req, res) => {
    const loggedInUserId = req.decodedData.id;

    try {
        // Step 1: Woh saare invitations dhoondo jahan loggedInUser connected hy
        const existingInvitations = await Invitation.find({
            $or: [
                { sender: loggedInUserId },
                { receiver: loggedInUserId }
            ]
        }).populate('sender receiver'); // Direct populate karein taaki data clear miley

        // Step 2: Un invitations se doosre users ki IDs nikal kar ek array banao
        const excludedUserIds = [loggedInUserId];

        existingInvitations.forEach(invite => {
            if (invite.sender._id.toString() === loggedInUserId.toString()) {
                excludedUserIds.push(invite.receiver._id);
            } else if (invite.receiver._id.toString() === loggedInUserId.toString()) {
                excludedUserIds.push(invite.sender._id);
            }
        });

        const filteredInvitations = existingInvitations.filter(invite => invite.status !== 'accepted' && invite.status !== 'rejected');

        // Step 3: $nin use karein taaki list clean ho jaye
        const allUsers = await User.find({
            _id: { $nin: excludedUserIds }
        }).select('name _id');

        return res.status(200).json({
            message: 'Fetched all users successfully',
            success: true,
            data: { allUsers, invites: filteredInvitations }
        });

    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
}



module.exports = { getAllUsers }
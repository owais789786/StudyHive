const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
    roomName: {
        type: String,
        required: true,
        unique: true
    },
    roomPassword: {
        type: String,
        required: true,
    },
    maxMembers: {
        type: Number,
        required: true
    },
    roomTags: {
        type: String,
        default: [],
        required: true
    },
    desc: {
        type: String,
        default: "No description given"
    },
    members: [{
        userId: { type: Schema.Types.ObjectId, ref: 'user' },
        joinedAt: { type: Date, default: Date.now },
        role: { type: String, required: true, default: 'member', enum: ['admin', 'member'] }
    }],
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },
    scope: {
        type: String,
        enum: ['private', 'public'],
        default: 'public'
    }
}, { timestamps: true })

const Room = model('Room', roomSchema);
module.exports = Room;
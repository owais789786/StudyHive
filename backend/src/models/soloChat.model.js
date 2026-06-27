const mongoose = require('mongoose');

const soloChatSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
        unique: true
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        dafault: null
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: {}
    }

}, { timestamps: true })
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chatId: {
        type: String,
        required: true
    },
    messageType: {
        type: String,
        enum: ['text', 'video', 'document', 'image'],
        default: 'text',
        required: true
    },
    content: {
        type: String,
        required: true,
    }

}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema); 
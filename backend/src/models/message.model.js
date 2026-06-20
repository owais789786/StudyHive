const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })

module.exports = model('Message', messageSchema)
const mongoose = require('mongoose');

const blackListedSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: {expires: 0}
    } 
}, { timestamps: true });

const BlackListedToken = mongoose.model('BlackListedToken', blackListedSchema);
module.exports = BlackListedToken;
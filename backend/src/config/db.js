const mongoose = require('mongoose');
const logger = require('../utils/logger');  // ← naya line

const connectDB = mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        logger.info('✅ MongoDB connected successfully');  // ← Winston use kar
    })
    .catch(error => {
        logger.error('❌ MongoDB connection failed', { error });  // ← Winston use kar
        process.exit(1);
    });

module.exports = connectDB;

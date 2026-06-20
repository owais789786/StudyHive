const winston = require('winston');
const path = require('path');

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Format define kar — kis tarah log print hona chahiye
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
});

// Logger create karo
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        // Error logs alag file mein
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error'
        }),
        // Sab kuch ek file mein
        new winston.transports.File({
            filename: path.join('logs', 'combined.log')
        })
    ]
});

// Development mein console pe bhi dikhao (terminal mein)
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: combine(
            colorize(),
            timestamp({ format: 'HH:mm:ss' }),
            errors({ stack: true }),
            logFormat
        )
    }));
}

module.exports = logger; 
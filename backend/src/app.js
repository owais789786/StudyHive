const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');          
const userRoutes = require('./routes/user.route');
const logger = require('./utils/logger'); 
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
));
app.use(cookieParser());

// Morgan se HTTP requests track kar Winston ke through
const morganStream = {
    write: (message) => logger.http(message.trim())
};
app.use(morgan('dev', { stream: morganStream }));

app.use('/api/users', userRoutes);

module.exports = app;
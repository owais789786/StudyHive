const User = require('../models/user.model');
const BlackListedToken = require('../models/blackListed.model');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const isAuthenticated = async (req, res, next) => {

    const token = req.cookies.Token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        logger.warn('⚠️ Auth attempt with no token');
        return res.status(401).json({
            message: 'Token not found please proceed to login',
            success: false
        });
    }
    try {
        const isBlackListed = await BlackListedToken.findOne({ token });
        if (isBlackListed) {
            return res.status(409).json({
                message: 'Token expired proceeding to login',
                success: false
            })
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedData.id
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(401).json({
                message: 'User not found proceeding to login',
                success: false
            });
        }
        req.user = user;
        req.decodedData = decodedData;
        console.log(decodedData)
        req.token = token
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }

}

module.exports = isAuthenticated;
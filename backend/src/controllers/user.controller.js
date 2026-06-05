const User = require('../models/user.model');
const { validationResult } = require('express-validator');
const BlackListedToken = require('../models/blackListed.model');
const logger = require('../utils/logger');

const signupHanlder = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        });
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All credentials are required",
            success: false
        })
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'User already exist with this email',
                success: false
            })
        }
        const newUser = await User.create({
            name, email, password
        });
        const token = newUser.generateToken();
        const user = newUser.toObject();
        delete user.password;
        res.cookie('Token', token);
        res.status(201).json({
            message: 'User registered successfully',
            success: true,
            data: user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}

const loginHandler = async (req, res) => {
    console.log("rquest ai")
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        });
    }
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(409).json({
            message: "All credentials are required",
            success: false
        })
    }
    try {
        const existingUser = await User.findOne({ email }).select('+password');
        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }
        const isMatch = await existingUser.comparePassword(password);
        if (!isMatch) {
            return res.status(409).json({
                message: 'Invalid email or password',
                success: false
            });
        }
        const user = existingUser.toObject();
        delete user.password;
        const token = await existingUser.generateToken();
        res.cookie('Token', token);
        return res.status(200).json({
            message: 'Logged in successfully',
            success: true,
            data: user
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}

const logoutHandler = async (req, res) => {
    try {
        const { decodedData, token } = req;
        const expiresAt = new Date(decodedData.exp * 1000);
        await BlackListedToken.create({ token, expiresAt });
        logger.info(`User with ID ${req.user._id} logged out successfully`);
        return res.clearCookie('Token').status(200).json({
            message: 'Logged out successfully',
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            success: false

        })
    }
}

module.exports = { signupHanlder, loginHandler, logoutHandler };
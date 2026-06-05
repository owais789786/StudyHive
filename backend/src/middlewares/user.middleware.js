const { body } = require('express-validator');

const validateRegistration = [
    body('name').notEmpty().isLength({ min: 3, max: 50 }).withMessage('Username must contain 3 characters'),
    body('email').notEmpty().isEmail().normalizeEmail().withMessage('Email formate is invalid'),
    body('password').notEmpty().isLength({ min: 5 }).withMessage('Password must be 5 characters long')
];

const validateLogin = [
    body('email').notEmpty().isEmail().normalizeEmail().withMessage('Email formate is invalid'),
    body('password').notEmpty().isLength({ min: 5 }).withMessage('Password must be 5 characters long')
];



module.exports = { validateRegistration, validateLogin };
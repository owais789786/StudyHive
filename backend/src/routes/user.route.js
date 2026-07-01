const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const isAuthenticated = require('../middlewares/auth.middleware');
const { validateRegistration, validateLogin } = require('../middlewares/user.middleware');
const { createRoom, getAllChats } = require('../controllers/room.controller');
const { getAllUsers } = require('../controllers/invitation.controller');

router.post('/signup', validateRegistration, userController.signupHanlder);
router.post('/login', validateLogin, userController.loginHandler);
router.get('/me', isAuthenticated, authController);
router.get('/logout', isAuthenticated, userController.logoutHandler);

router.post('/room', isAuthenticated, createRoom);
router.get('/friends', isAuthenticated, getAllUsers);
router.get('/chatlist/:userId', isAuthenticated, getAllChats);



module.exports = router;
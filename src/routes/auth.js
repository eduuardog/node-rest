const { Router } = require('express');
const authController = require('../controllers/authController');

const authRoutes = Router();

authRoutes.post('/register', authController.register);
authRoutes.post('/authenticate', authController.authenticate);
authRoutes.post('/forgot_password', authController.forgotPassword);
authRoutes.post('/reset_password', authController.resetPassword);

module.exports = authRoutes;


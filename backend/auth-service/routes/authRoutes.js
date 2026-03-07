const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');


// ─── POST  /auth/signup ───

router.post('/signup', authController.signUp);


// ─── POST  /auth/verify-otp ───

router.post('/verify-otp', authController.verifyOtp);


// ─── POST  /auth/login ───

router.post('/login', authController.login);


// ─── POST  /auth/forgot-password ───

router.post('/forgot-password', authController.forgotPassword);


// ─── POST  /auth/verify-reset-otp ───

router.post('/verify-reset-otp', authController.verifyResetOtp);


// ─── POST  /auth/change-password ───

router.post('/change-password', authController.changePassword);


module.exports = router;


module.exports = router;



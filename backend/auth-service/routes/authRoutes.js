const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');


// ─── POST  /auth/signup ───

router.post('/signup', authController.signUp);


// ─── POST  /auth/verify-otp ───

router.post('/verify-otp', authController.verifyOtp);


module.exports = router;



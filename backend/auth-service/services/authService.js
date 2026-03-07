const bcrypt = require('bcrypt');
const authRepository = require('../repository/authRepository');
const { generateOtp } = require('./otpService');
const { sendOtpEmail } = require('./emailService');

const SALT_ROUNDS = 10;


// ─── Sign-Up Logic ───

const signUp = async ({ email, fullName, password, gitHubUserName, linkedInUserName }) => {

  // 1. Hash the password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 2. Check if user already exists
  const existingUser = await authRepository.findUserByEmail(email);

  let user;

  if (existingUser) {

    // 2a. Already verified → reject
    if (existingUser.is_verified) {
      const error = new Error('A verified account with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    // 2b. Exists but NOT verified → update their details and resend OTP
    user = await authRepository.updateUser({
      email,
      fullName,
      hashedPassword,
      gitHubUserName,
      linkedInUserName,
    });

  } else {

    // 3. Brand-new user → insert
    user = await authRepository.createUser({
      email,
      fullName,
      hashedPassword,
      gitHubUserName,
      linkedInUserName,
    });
  }


  // 4. Generate OTP, store it, and send via email
  const otpCode = generateOtp();
  await authRepository.createOtpVerification(email, otpCode);
  await sendOtpEmail(email, otpCode);


  return {
    message: 'OTP has been sent to your email. Please verify to complete sign-up.',
    user,
  };
};


// ─── Verify OTP Logic ───

const verifyOtp = async ({ email, otp }) => {

  // 1. Fetch the latest OTP row for this email
  const otpRecord = await authRepository.findLatestOtp(email);

  if (!otpRecord) {
    const error = new Error('No OTP found for this email. Please sign up first.');
    error.statusCode = 404;
    throw error;
  }


  // 2. Check if the OTP has expired
  if (new Date(otpRecord.expires_at) < new Date()) {
    const error = new Error('OTP has expired. Please request a new one.');
    error.statusCode = 410;
    throw error;
  }


  // 3. Match the OTP code
  if (otpRecord.otp_code !== otp) {
    const error = new Error('Invalid OTP. Please try again.');
    error.statusCode = 401;
    throw error;
  }


  // 4. Mark user as verified and clean up all OTPs
  await authRepository.markUserVerified(email);
  await authRepository.deleteOtpsByEmail(email);


  return {
    message: 'Email verified successfully. You can now log in.',
  };
};


module.exports = { signUp, verifyOtp, verifyOtp };

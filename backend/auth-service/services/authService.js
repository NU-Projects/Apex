const bcrypt = require('bcrypt');
const authRepository = require('../repository/authRepository');
const { generateOtp } = require('./otpService');
const { sendOtpEmail } = require('./emailService');
const supabase = require('../config/supabase');

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

  // 5. Sync with Supabase Auth (Admin API to avoid confirm email)
  try {
    const { data: sbData, error: sbError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { fullName, gitHubUserName, linkedInUserName }
    });

    // If user already exists in Supabase, update their password to stay in sync
    if (sbError && sbError.status === 422) {
      const { data: listData } = await supabase.auth.admin.listUsers();
      const sbUser = listData?.users?.find(u => u.email === email);
      if (sbUser) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(sbUser.id, {
          password,
          user_metadata: { fullName, gitHubUserName, linkedInUserName }
        });
        if (updateError) {
          console.error('Supabase password sync failed:', updateError.message);
        }
      }
    } else if (sbError) {
      console.error('Supabase identity sync failed:', sbError.message);
    }
  } catch (err) {
    console.error('Error syncing with Supabase:', err.message);
  }

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


  // 2. Check if the OTP has expired (compared inside PostgreSQL)
  if (otpRecord.is_expired) {
    const error = new Error('OTP has expired. Please request a new one.');
    error.statusCode = 410;
    throw error;
  }


  // 3. Match the OTP code
  if (otpRecord.otp_code !== String(otp)) {
    const error = new Error('Invalid OTP. Please try again.');
    error.statusCode = 401;
    throw error;
  }


  // 4. Mark user as verified and clean up all OTPs
  const verifiedUser = await authRepository.markUserVerified(email);
  await authRepository.deleteOtpsByEmail(email);


  return {
    message: 'Email verified successfully. You can now log in.',
    user: verifiedUser ? {
      email: verifiedUser.email,
      fullName: verifiedUser.full_name,
      gitHubUserName: verifiedUser.github_username,
      linkedInUserName: verifiedUser.linkedin_username,
      isVerified: verifiedUser.is_verified,
      skills: verifiedUser.skills || [],
    } : null,
  };
};


// ─── Login Logic ───

const login = async ({ email, password }) => {

  // 1. Find user — includes hashed password
  const user = await authRepository.findUserForLogin(email);

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }


  // 2. Block unverified accounts
  if (!user.is_verified) {
    const error = new Error('Account is not verified. Please verify your email first.');
    error.statusCode = 403;
    throw error;
  }


  // 3. Compare provided password against stored hash
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // 4. Authenticate with Supabase to get a real JWT
  const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (sbError) {
    const error = new Error('Identity verification failed: ' + sbError.message);
    error.statusCode = 401;
    throw error;
  }

  return {
    message: 'Login successful.',
    accessToken: sbData.session.access_token,
    user: {
      email: user.email,
      fullName: user.full_name,
      gitHubUserName: user.github_username,
      linkedInUserName: user.linkedin_username,
      isVerified: user.is_verified,
      skills: user.skills || [],
    },
  };
};


// ─── Forgot Password Logic ───

const forgotPassword = async ({ email }) => {

  // 1. Check if user exists and is verified
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    const error = new Error('No account found with this email');
    error.statusCode = 404;
    throw error;
  }

  if (!user.is_verified) {
    const error = new Error('Account is not verified. Please verify your email first.');
    error.statusCode = 403;
    throw error;
  }


  // 2. Generate OTP, store it, and send via email
  const otpCode = generateOtp();
  await authRepository.createOtpVerification(email, otpCode);
  await sendOtpEmail(email, otpCode);


  return {
    message: 'OTP has been sent to your email for password reset.',
  };
};


// ─── Verify Reset OTP Logic ───

const verifyResetOtp = async ({ email, otp }) => {

  // 1. Fetch the latest OTP row for this email
  const otpRecord = await authRepository.findLatestOtp(email);

  if (!otpRecord) {
    const error = new Error('No OTP found for this email.');
    error.statusCode = 404;
    throw error;
  }


  // 2. Check if the OTP has expired
  if (otpRecord.is_expired) {
    const error = new Error('OTP has expired. Please request a new one.');
    error.statusCode = 410;
    throw error;
  }


  // 3. Match the OTP code
  if (otpRecord.otp_code !== String(otp)) {
    const error = new Error('Invalid OTP. Please try again.');
    error.statusCode = 401;
    throw error;
  }


  // 4. OTP matched — clean up all OTPs for this email
  await authRepository.deleteOtpsByEmail(email);


  return {
    message: 'OTP verified successfully. You can now reset your password.',
  };
};


// ─── Change Password Logic ───

const changePassword = async ({ email, password }) => {

  // 1. Check user exists
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    const error = new Error('No account found with this email');
    error.statusCode = 404;
    throw error;
  }


  // 2. Hash and update locally
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  await authRepository.updatePassword(email, hashedPassword);

  // 3. Sync new password to Supabase
  try {
    const { data: listData } = await supabase.auth.admin.listUsers();
    const sbUser = listData?.users?.find(u => u.email === email);
    if (sbUser) {
      const { error: updateError } = await supabase.auth.admin.updateUserById(sbUser.id, {
        password,
      });
      if (updateError) {
        console.error('Supabase password sync failed:', updateError.message);
      }
    }
  } catch (err) {
    console.error('Error syncing password with Supabase:', err.message);
  }

  return {
    message: 'Password updated successfully.',
  };
};


module.exports = { signUp, verifyOtp, login, forgotPassword, verifyResetOtp, changePassword };

const authService = require('../services/authService');


// ─── POST /auth/signup ───

const signUp = async (req, res) => {

  try {
    const { email, fullName, password, gitHubUserName, linkedInUserName } = req.body;

    const result = await authService.signUp({
      email,
      fullName,
      password,
      gitHubUserName,
      linkedInUserName,
    });

    return res.status(201).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
      },
    });

  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.statusCode ? err.message : 'Internal server error';

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};


// ─── POST /auth/verify-otp ───

const verifyOtp = async (req, res) => {

  try {
    const { email, otp } = req.body;

    const result = await authService.verifyOtp({ email, otp });

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
      },
    });

  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.statusCode ? err.message : 'Internal server error';

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};


// ─── POST /auth/login ───

const login = async (req, res) => {

  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });

  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.statusCode ? err.message : 'Internal server error';

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};


// ─── POST /auth/forgot-password ───

const forgotPassword = async (req, res) => {

  try {
    const { email } = req.body;

    const result = await authService.forgotPassword({ email });

    return res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.statusCode ? err.message : 'Internal server error';

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};


// ─── POST /auth/verify-reset-otp ───

const verifyResetOtp = async (req, res) => {

  try {
    const { email, otp } = req.body;

    const result = await authService.verifyResetOtp({ email, otp });

    return res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.statusCode ? err.message : 'Internal server error';

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};


// ─── POST /auth/change-password ───

const changePassword = async (req, res) => {

  try {
    const { email, password } = req.body;

    const result = await authService.changePassword({ email, password });

    return res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.statusCode ? err.message : 'Internal server error';

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};


module.exports = { signUp, verifyOtp, login, forgotPassword, verifyResetOtp, changePassword };

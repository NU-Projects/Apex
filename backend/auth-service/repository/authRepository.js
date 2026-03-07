const pool = require('../config/db');


// ─── Check if a user with this email already exists ───

const findUserByEmail = async (email) => {

  const query = 'SELECT email, is_verified FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);

  return rows[0] || null;
};


// ─── Insert a new user row ───

const createUser = async ({ email, fullName, hashedPassword, gitHubUserName, linkedInUserName }) => {

  const query = `
    INSERT INTO users (email, full_name, password, github_username, linkedin_username, is_verified)
    VALUES ($1, $2, $3, $4, $5, false)
    RETURNING email, full_name, github_username, linkedin_username, is_verified
  `;

  const values = [email, fullName, hashedPassword, gitHubUserName, linkedInUserName];
  const { rows } = await pool.query(query, values);

  return rows[0];
};


// ─── Update an existing unverified user's details ───

const updateUser = async ({ email, fullName, hashedPassword, gitHubUserName, linkedInUserName }) => {

  const query = `
    UPDATE users
    SET full_name = $2, password = $3, github_username = $4, linkedin_username = $5
    WHERE email = $1
    RETURNING email, full_name, github_username, linkedin_username, is_verified
  `;

  const values = [email, fullName, hashedPassword, gitHubUserName, linkedInUserName];
  const { rows } = await pool.query(query, values);

  return rows[0];
};


// ─── Insert an OTP verification row (5-min expiry) ───

const createOtpVerification = async (email, otpCode) => {

  const query = `
    INSERT INTO otp_verifications (email, otp_code, expires_at)
    VALUES ($1, $2, NOW() + INTERVAL '5 minutes')
    RETURNING id, email, otp_code, expires_at
  `;

  const { rows } = await pool.query(query, [email, otpCode]);

  return rows[0];
};


// ─── Get the latest OTP for an email (the one expiring last) ───

const findLatestOtp = async (email) => {

  const query = `
    SELECT otp_code, expires_at, (expires_at < NOW()) AS is_expired
    FROM otp_verifications
    WHERE email = $1
    ORDER BY expires_at DESC
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [email]);

  return rows[0] || null;
};


// ─── Mark a user as verified ───

const markUserVerified = async (email) => {

  const query = `
    UPDATE users
    SET is_verified = true
    WHERE email = $1
  `;

  await pool.query(query, [email]);
};


// ─── Delete all OTP rows for a given email ───

const deleteOtpsByEmail = async (email) => {

  const query = 'DELETE FROM otp_verifications WHERE email = $1';

  await pool.query(query, [email]);
};


module.exports = {
  findUserByEmail,
  createUser,
  updateUser,
  createOtpVerification,
  findLatestOtp,
  markUserVerified,
  deleteOtpsByEmail,
};

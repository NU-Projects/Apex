const crypto = require('crypto');


// ─── Generate a random 6-digit numeric OTP ───

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};


module.exports = { generateOtp };

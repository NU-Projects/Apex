const nodemailer = require('nodemailer');


// ─── Gmail transporter using EMAIL_USER & EMAIL_PASS from .env ───

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// ─── Send OTP email with styled HTML ───

const sendOtpEmail = async (recipientEmail, otpCode) => {

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">

      <h2 style="text-align: center; color: #1a202c; margin-bottom: 8px;">
        Verify Your Email
      </h2>

      <p style="text-align: center; color: #718096; font-size: 14px; margin-bottom: 28px;">
        Use the code below to complete your sign-up. It expires in <strong>5 minutes</strong>.
      </p>

      <div style="text-align: center; margin: 24px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #2d3748; background-color: #edf2f7; padding: 16px 32px; border-radius: 8px;">
          ${otpCode}
        </span>
      </div>

      <p style="text-align: center; color: #a0aec0; font-size: 12px; margin-top: 28px;">
        If you did not request this, you can safely ignore this email.
      </p>

    </div>
  `;

  const mailOptions = {
    from: `"Auth Service" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: 'Your OTP Verification Code',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};


module.exports = { sendOtpEmail };

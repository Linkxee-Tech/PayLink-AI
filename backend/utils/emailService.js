const nodemailer = require('nodemailer');

// Mock email transporter for development
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER || 'demo@ethereal.email',
    pass: process.env.EMAIL_PASS || 'demo_pass',
  },
});

exports.sendOTP = async (email, otp, type = 'Verification') => {
  const mailOptions = {
    from: '"PayLink-AI NEMIS" <noreply@paylink-ai.gov.ng>',
    to: email,
    subject: `PayLink-AI: Your ${type} Code`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 20px;">
        <h2 style="color: #0284c7; text-align: center;">PayLink-AI</h2>
        <p style="font-size: 16px; color: #475569;">Hello,</p>
        <p style="font-size: 16px; color: #475569;">Your ${type} code is:</p>
        <div style="background: #f0f9ff; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0369a1;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #94a3b8;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; text-align: center; color: #94a3b8;">&copy; 2026 PayLink-AI National Emergency Medical Insurance System</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    // For ethereal email, we can log the preview URL
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    return true;
  } catch (error) {
    console.error("Email error: ", error);
    return false;
  }
};

import nodemailer from 'nodemailer';

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.EMAIL_FROM || 'ab29b5001@smtp-brevo.com';
const SMTP_PASS = process.env.BREVO_SMTP_KEY;

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, 
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

/**
 * Sends a general HTML email.
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    if (!SMTP_PASS || !SMTP_USER) {
      console.warn('⚠️ SMTP credentials missing! Mocking email.');
      return { success: true, mocked: true };
    }

    const info = await transporter.sendMail({
      from: `"SPORVIA Admin" <${SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error };
  }
};


/**
 * Sends an OTP verification email to the user.
 */
export const sendOTPVerificationEmail = async (email: string, otp: string) => {
  try {
    // If credentials are missing, we still log but the user wants them in mail.
    // If they are missing in the environment, this will fail.
    if (!SMTP_PASS || !SMTP_USER) {
      console.error('❌ SMTP credentials missing! Cannot send real email.');
      console.log(`Fallback OTP for ${email}: ${otp}`);
      return { success: false, error: 'Credentials missing' };
    }

    const info = await transporter.sendMail({
      from: `"SPORVIA Admin" <${SMTP_USER}>`,
      to: email,
      subject: "Your SPORVIA Registration OTP",
      text: `Welcome to SPORVIA! Your verification code is: ${otp}. This code is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #1e3a8a; text-align: center;">Welcome to SPORVIA!</h2>
          <p style="font-size: 16px; color: #333;">Thank you for starting your registration. Please use the following One-Time Password (OTP) to verify your email address:</p>
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #f97316; letter-spacing: 5px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #64748b;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">© ${new Date().getFullYear()} SPORVIA. All rights reserved.</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully:", info.messageId);
    console.log(`[BACKUP] OTP for ${email} is: ${otp}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    return { success: false, error };
  }
};

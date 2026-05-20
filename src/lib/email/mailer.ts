import nodemailer from "nodemailer";

/**
 * =========================
 * GOOGLE SMTP CONFIG
 * =========================
 * Make sure you use Gmail App Password (NOT normal password)
 */

const SMTP_USER = process.env.SMTP_USER; // yourgmail@gmail.com
const SMTP_PASS = process.env.SMTP_PASS; // 16-digit app password

if (!SMTP_USER || !SMTP_PASS) {
  console.warn("⚠️ SMTP credentials are missing in environment variables.");
}

/**
 * Create Nodemailer transporter
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

/**
 * =========================
 * 1. GENERIC EMAIL SENDER
 * =========================
 */
export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    if (!SMTP_USER || !SMTP_PASS) {
      throw new Error("SMTP credentials missing");
    }

    const info = await transporter.sendMail({
      from: `"SPORVIA" <${SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ sendEmail error:", error);
    return {
      success: false,
      error,
    };
  }
};

/**
 * =========================
 * 2. OTP EMAIL SENDER
 * =========================
 */
export const sendOTPVerificationEmail = async (
  email: string,
  otp: string
) => {
  try {
    if (!SMTP_USER || !SMTP_PASS) {
      throw new Error("SMTP credentials missing");
    }

    const info = await transporter.sendMail({
      from: `"SPORVIA" <${SMTP_USER}>`,
      to: email,
      subject: "Your OTP Verification Code",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Please use the OTP below:</p>

          <div style="font-size: 28px; font-weight: bold; color: #f97316; letter-spacing: 5px; text-align:center;">
            ${otp}
          </div>

          <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>

          <hr />
          <p style="font-size: 12px; color: gray;">
            © ${new Date().getFullYear()} SPORVIA
          </p>
        </div>
      `,
    });

    console.log("✅ OTP email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ OTP email error:", error);
    return {
      success: false,
      error,
    };
  }
};

/**
 * =========================
 * 3. PAYMENT EMAIL SENDER
 * =========================
 */
export const sendPaymentEmail = async (
  email: string,
  amount: number,
  paymentId: string
) => {
  try {
    const info = await transporter.sendMail({
      from: `"SPORVIA Payments" <${SMTP_USER}>`,
      to: email,
      subject: "Payment Successful",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color: green;">Payment Successful ✅</h2>

          <p>Your payment was successful.</p>

          <h3>Transaction Details:</h3>
          <ul>
            <li><b>Amount:</b> ₹${amount}</li>
            <li><b>Payment ID:</b> ${paymentId}</li>
            <li><b>Date:</b> ${new Date().toLocaleString()}</li>
          </ul>

          <p>Thank you for your payment.</p>

          <hr />
          <p style="font-size: 12px; color: gray;">
            © ${new Date().getFullYear()} SPORVIA
          </p>
        </div>
      `,
    });

    console.log("💳 Payment email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Payment email error:", error);
    return {
      success: false,
      error,
    };
  }
};

/**
 * =========================
 * 4. REMINDER EMAIL SENDER
 * =========================
 */
export const sendReminderEmail = async (
  email: string,
  name: string,
  hours: number
) => {
  try {
    const info = await transporter.sendMail({
      from: `"SPORVIA Support" <${SMTP_USER}>`,
      to: email,
      subject: `Reminder: Complete your registration (${hours}h remaining)`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #f97316;">Registration Reminder ⏳</h2>
          <p>Hi <b>${name}</b>,</p>
          <p>We noticed you started your registration on SPORVIA but haven't completed the payment yet.</p>
          <p>It's been ${hours} hours since you started. Please complete your payment to secure your spot in the competition.</p>
          
          <div style="margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" 
               style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
               Complete Registration Now
            </a>
          </div>

          <p>If you have already paid, please ignore this email or contact support.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">
            © ${new Date().getFullYear()} SPORVIA. All rights reserved.
          </p>
        </div>
      `,
    });

    console.log(`🔔 Reminder (${hours}h) email sent to ${email}:`, info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Reminder email error:", error);
    return {
      success: false,
      error,
    };
  }
};
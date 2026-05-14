const nodemailer = require('nodemailer');
require('dotenv').config();

const SMTP_HOST = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.EMAIL_FROM;
const SMTP_PASS = process.env.BREVO_SMTP_KEY;

console.log('Testing SMTP connection with:');
console.log('Host:', SMTP_HOST);
console.log('Port:', SMTP_PORT);
console.log('User:', SMTP_USER);
console.log('Pass:', SMTP_PASS ? '********' : 'MISSING');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, 
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Connection failed:');
    console.error(error);
  } else {
    console.log('✅ Server is ready to take our messages');
    
    // Try sending a test mail
    const mailOptions = {
      from: `"SPORVIA Test" <${SMTP_USER}>`,
      to: SMTP_USER, // Send to self
      subject: 'SMTP Test Email',
      text: 'If you see this, SMTP is working perfectly!'
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('❌ Failed to send test email:');
        console.error(err);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
      }
      process.exit();
    });
  }
});

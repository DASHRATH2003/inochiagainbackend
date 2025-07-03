const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
  debug: true
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('Server connection error:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  const {
    from_name,
    from_email,
    company_name,
    phone_number,
    country,
    subject,
    message,
    inquiry_type
  } = req.body;

  try {
    // Test the connection before sending
    await transporter.verify();
    
    const mailOptions = {
      from: `${from_name} <${process.env.EMAIL_USER}>`,
      to: 'vijayakumar@inochiinternational.in',
      replyTo: from_email,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${from_name}</p>
        <p><strong>Company:</strong> ${company_name}</p>
        <p><strong>Email:</strong> ${from_email}</p>
        <p><strong>Phone:</strong> ${phone_number}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Inquiry Type:</strong> ${inquiry_type}</p>
        <h3>Message:</h3>
        <p>${message}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    console.error('Detailed Email Error:', {
      error: error,
      message: error.message,
      code: error.code,
      command: error.command
    });
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/users'); // Assuming you're using Mongoose to interact with MongoDB
require('dotenv').config();

// Set up Nodemailer transport
const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// Generate a random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send email function
const sendEmail = async ({ recipients, subject, message }) => {
    await transport.sendMail({
        from: process.env.MAIL_FROM || 'no-reply@example.com',
        to: recipients,
        subject,
        html: `<p>${message}</p>`,
    });
};

// Route to send OTP
router.post('/send-email', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ error: 'Email is required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpExpiry = Date.now() + 10 * 60 * 1000; // Expire in 10 minutes

        user.otp = hashedOtp;
        user.otpSentAt = otpExpiry;
        await user.save();

        const subject = 'Your OTP Code';
        const message = `Your OTP code is ${otp}. It will expire in 10 minutes.`;

        await sendEmail({ recipients: email, subject, message });

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword)
            return res.status(400).json({ error: 'Email, OTP, and new password are required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!user.otp || !user.otpSentAt || Date.now() > user.otpSentAt)
            return res.status(400).json({ error: 'OTP has expired' });

        const isOtpValid = await bcrypt.compare(otp, user.otp);
        if (!isOtpValid) return res.status(400).json({ error: 'Invalid OTP' });

        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = undefined;
        user.otpSentAt = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
});

module.exports = router;

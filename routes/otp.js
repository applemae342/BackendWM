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
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if OTP has expired
        if (!user.otp || !user.otpSentAt || Date.now() > user.otpSentAt) {
            return res.status(400).json({ error: 'OTP has expired or is invalid' });
        }

        const isOtpValid = await bcrypt.compare(otp, user.otp);
        if (!isOtpValid) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // OTP is valid
        user.otp = undefined; // Clear OTP after successful verification
        user.otpSentAt = undefined; // Clear OTP timestamp
        await user.save();

        res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
});


// Password change route
// Password change route
router.post('/password-change', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for missing fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Log the old hashed password (before change)
        console.log('Old hashed password:', user.password);

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Log the new hashed password
        console.log('New hashed password:', hashedPassword);

        // Update the user's password
        user.password = hashedPassword;

        // Save the updated user
        await user.save();

        // Fetch the updated user to ensure the password is saved
        const updatedUser = await User.findById(user._id);
        console.log('Updated user password (hashed):', updatedUser.password);

        // Respond with success message
        res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error in password change:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});



module.exports = router;

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');


require('dotenv').config();


if (!process.env.MAIL_HOST || !process.env.MAIL_PORT || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.error('Error: Missing required environment variables for mail configuration.');
    process.exit(1); 
}



const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10),
    secure: false, 
    auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS,  
    },
    debug: true, 
    logger: true,
});


const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000); 
    return otp.toString();
};


const sendEmail = async ({ recipients, subject, message }) => {
    try {
        const response = await transport.sendMail({
            from: 'no-reply@example.com',
            to: recipients,
            subject,
            text: message,
            html: `<p>${message}</p>`,
        });
        console.log('Email sent:', response);
        return response;
    } catch (error) {
        console.error('Error while sending email:', error);
        throw new Error('Failed to send email');
    }
};


router.post('/send-email', async (req, res) => {
    try {
        const { email } = req.body;

      
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

       
        const otp = generateOTP();

       
        const subject = 'Your OTP Code for Password Reset';
        const message = `Your OTP code is ${otp}. This code will expire in 10 minutes.`;

       
        await sendEmail({ recipients: email, subject, message });


        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error in /send-email route:', error);
        res.status(500).json({ success: false, error: 'Failed to send OTP' });
    }
});

module.exports = router;

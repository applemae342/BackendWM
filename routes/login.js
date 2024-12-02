const express = require('express');
const router = express.Router();
const User = require('../models/users'); // Adjust the path as needed
const bcrypt = require('bcrypt');

// Login route
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    // Validate incoming data
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Successful login
        return res.status(200).json({
            message: 'Login successful',    
            user: {
                userID:user.userId,
                username: user.username,
                password: user.password,  // Returning the password (ensure this is secure)
                routesID: user.routesID,  // Assuming your User model has a 'routesID' field
                role: user.role,           // Assuming your User model has a 'role' field
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;

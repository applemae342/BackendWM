const express = require('express');
const router = express.Router();
const Truck = require('../models/trucks'); // Ensure the path to your model is correct
const bcrypt = require('bcrypt');

// 1. Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;  // Use 'username' and 'password' for login

    // Validate incoming data
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Find the truck by username
        const truck = await Truck.findOne({ username });
        if (!truck) {
            return res.status(404).json({ message: 'Truck not found' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, truck.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Save truck data in session
        req.session.truck = {
            truckID: truck._id,
            username: truck.username,
            description: truck.description,
            plateNumber: truck.plateNumber,
            routesID: truck.routesID,
            reset: truck.reset

        };

        // Return all truck details if login is successful
        res.status(200).json({
            message: 'Login successful',
            truck: req.session.truck  // Returning session data
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// 2. Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Could not log out. Please try again.' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        console.log('Logout successful'); // Debugging
        return res.status(200).json({ message: 'Logout successful' });
    });
});

module.exports = router;

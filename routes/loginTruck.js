const express = require('express');
const router = express.Router();
const Truck = require('../models/trucks'); // Ensure the path to your model is correct
const bcrypt = require('bcrypt');

// 1. Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;  // Use 'username' and 'password' for login

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

        // Return all truck details if login is successful
        res.status(200).json({
            message: 'Login successful',
            truck: truck  // Returning the entire truck document
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;

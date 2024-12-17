const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');

// Route to create a new user
router.post('/', async (req, res) => {
    try {
        const { firstname, lastname, address, contactNumber, username,  password ,reset} = req.body;

        // Validate incoming data
        if (!firstname || !lastname || !address || !contactNumber || !username || !password ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

     

        // Create a new user with a unique userId (auto-generated)
        const newUser = new User({
            firstname,
            lastname,
            address,
            contactNumber,
            username,
            reset,
            password
        });
console.log(newUser)
        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        // Handle specific errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }

        if (error.code && error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Duplicate field value entered' });
        }

        console.error(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});



module.exports = router;

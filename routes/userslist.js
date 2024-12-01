const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');



// Get users from MongoDB
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});
router.put('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body; // Role is sent in the request body

    // Validate that the role is one of the allowed values
    const allowedRoles = ['resident', 'admin'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Must be resident or admin.' });
    }

    try {
        // Find the user by userId and update the role
        const user = await User.findOneAndUpdate(
            { userId: userId },
            { role: role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User role updated successfully.', user });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});
router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findOneAndDelete({ userId: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});
module.exports = router;

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
        console.error(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

router.put('/updatepassword/:userId', async (req, res) => {
    const { userId } = req.params;
    const { password } = req.body;

    try {
        // Check if a password is being updated
        if (password) {
            // Hash the password before updating
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(password, salt);
        }

        // Find the user by userId and update with new values from req.body
        const updatedUser = await User.findOneAndUpdate(
            { userId },                  // Find the user by userId
            { ...req.body }, // Update password and set reset to 'no'
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return the updated user info (excluding password)
        res.status(200).json({
            message: 'Password updated successfully.',
            user: {
                userId: updatedUser.userId,
                username: updatedUser.username,
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});



// Delete user by userID
router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findOneAndDelete({ userId: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;

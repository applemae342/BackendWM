const express = require('express');
const router = express.Router();
const ResetPass = require('../models/resetPassword'); // Ensure the path to your model is correct

// 1. Create a new reset password entry
router.post('/create', async (req, res) => {
    try {
        const resetPass = await ResetPass.create(req.body);
        res.status(201).json(resetPass); // 201 Created status
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// 2. Get all reset password entries
router.get('/getAll', async (req, res) => {
    try {
        const resetPasses = await ResetPass.find({});
        res.status(200).json(resetPasses);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});



// 4. Update a reset password entry by resetPassID
// 4. Update user password using userId
router.put('/update/:userId', async (req, res) => {
    try {
        // Find and update the password for the given userId
        const updatedResetPass = await ResetPass.findOneAndUpdate(
            { userId: req.params.userId }, // Find by userId
            req.body, // Update with new data (e.g., new password)
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedResetPass) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedResetPass);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// 5. Delete a reset password entry by userId
router.delete('/delete/:userId', async (req, res) => {
    try {
        // Find and delete the reset password entry by userId
        const deletedResetPass = await ResetPass.findOneAndDelete({ userId: req.params.userId });

        if (!deletedResetPass) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Password reset entry deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


module.exports = router;

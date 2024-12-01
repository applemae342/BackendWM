const express = require('express');
const router = express.Router();
const Flag = require('../models/sharingFlag'); // Ensure the path to your model is correct

// 1. Create a new sharing flag
router.post('/create', async (req, res) => {
    try {
        const { flagStatus, userName, latitude, longitude,userID } = req.body;

        // Ensure flagStatus, userName, latitude, and longitude are provided
        if (!flagStatus || !userName || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: 'flagStatus, userName, latitude, and longitude are required' });
        }

        // Create a new flag instance
        const newFlag = new Flag({ flagStatus, userName, latitude, longitude ,userID});

        // Save the flag to the database
        const savedFlag = await newFlag.save();
        res.status(201).json(savedFlag); // Return the newly created flag
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// 2. Update a sharing flag by userID
router.put('/update/:userID', async (req, res) => {
    const { userID } = req.params;
    const { flagStatus, latitude, longitude } = req.body;  // Assuming you want to update flagStatus and position

    try {
        // Ensure flagStatus, latitude, and longitude are provided
        if (!flagStatus || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: 'flagStatus, latitude, and longitude are required' });
        }

        // Update the flag with the provided userName
        const updatedFlag = await Flag.findOneAndUpdate(
            { userID }, // Find the flag by userName
            { flagStatus, latitude, longitude }, // Update flagStatus, latitude, and longitude
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedFlag) {
            return res.status(404).json({ message: 'Flag not found for the provided userID' });
        }

        res.status(200).json(updatedFlag); // Return the updated flag
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// 3. Get all sharing flags
router.get('/getAll', async (req, res) => {
    try {
        // Fetch all flags from the database
        const flags = await Flag.find({}); // Retrieves all flags

        res.status(200).json(flags); // Return all flags
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Export the router
module.exports = router;

const express = require('express');
const router = express.Router();
const ResidentStatus = require('../models/residents_status'); // Correct the path

// Create a new resident status
router.post('/set', async (req, res) => {
    try {
        const residentsStatus = await ResidentStatus.create(req.body);
        res.status(200).json(residentsStatus);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Get all resident statuses
router.get('/getAll', async (req, res) => {
    try {
        const residentsStatus = await ResidentStatus.find({});
        res.status(200).json(residentsStatus);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Get a resident's status by userID
router.get('/getByUserID/:userID', async (req, res) => {
    const { userID } = req.params; // Get userID from the URL

    try {
        const residentStatus = await ResidentStatus.findOne({ userID }); // Find status by userID

        if (!residentStatus) {
            return res.status(404).json({ message: "Resident status not found" });
        }

        res.status(200).json(residentStatus);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Update a resident's status using userID
router.put('/update/:userID', async (req, res) => {
    const { userID } = req.params; // Get userID from the URL
    const { statusName } = req.body; // Get the new status from the request body

    try {
        const updatedStatus = await ResidentStatus.findOneAndUpdate(
            { userID }, // Find by userID
            { statusName }, // Update the statusName
            { new: true } // Return the updated document
        );

        if (!updatedStatus) {
            return res.status(404).json({ message: "Resident status not found" });
        }

        res.status(200).json(updatedStatus);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

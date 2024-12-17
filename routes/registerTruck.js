const express = require('express');
const router = express.Router();
const Truck = require('../models/trucks'); // Ensure the path to your model is correct
const bcrypt = require('bcrypt');
const session = require('express-session');

// 1. Create a new truck
router.post('/create', async (req, res) => {
    try {
        const truck = await Truck.create(req.body);
        res.status(201).json(truck); // 201 Created status
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// 2. Get all trucks
router.get('/getAll', async (req, res) => {
    try {
        const trucks = await Truck.find({});
        res.status(200).json(trucks);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

router.put('/update/:truckId', async (req, res) => {
    const { truckId } = req.params;
    const { password } = req.body;

    try {
        // Check if a password is being updated
        if (password) {
            // Hash the password before updating
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(password, salt);
        }

        const updatedTruck = await Truck.findOneAndUpdate(
            { truckId },                // Find the truck by truckId
            { ...req.body }, // Update password and set reset to 'no'
            { new: true, runValidators: true }  // Return the updated document
        );

        if (!updatedTruck) {
            return res.status(404).json({ message: 'Truck not found' });
        }

        res.status(200).json(updatedTruck);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// 4. Update a truck by truckId
router.put('/update/:truckId', async (req, res) => {
    const { truckId } = req.params;
    try {
        const updatedTruck = await Truck.findOneAndUpdate(
            { truckId },               // Find the truck by truckId
            req.body,                  // Update with new values from req.body
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedTruck) {
            return res.status(404).json({ message: 'Truck not found' });
        }

        res.status(200).json(updatedTruck);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// 5. Delete a truck by truckId
router.delete('/delete/:truckId', async (req, res) => {
    try {
        const deletedTruck = await Truck.findOneAndDelete({ truckId: req.params.truckId });
        if (!deletedTruck) {
            return res.status(404).json({ message: 'Truck not found' });
        }
        res.status(200).json({ message: 'Truck deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const History = require('../models/history'); // Ensure the path to the model is correct

// 1. Create a new history record
router.post('/create', async (req, res) => {
    try {
        const history = await History.create(req.body);
        res.status(201).json(history); // Respond with the created record
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// 2. Get all history records
router.get('/getAll', async (req, res) => {
    try {
        const histories = await History.find(); // Fetch all history records
        res.status(200).json(histories); // Respond with the fetched records
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

const mongoose = require('mongoose');

router.delete('/delete/:date', async (req, res) => {
    const { date } = req.params;

    try {
        // Validate the provided date format (YYYY-MM-DD)
        const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
        if (!isValidDate) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        // Use aggregation query to match only the date part
        const deletedHistory = await History.deleteMany({
            date: {
                $gte: new Date(`${date}T00:00:00.000Z`),
                $lt: new Date(`${date}T23:59:59.999Z`)
            }
        });

        if (deletedHistory.deletedCount === 0) {
            return res.status(404).json({ message: 'No history records found for the given date' });
        }

        res.status(200).json({ message: `${deletedHistory.deletedCount} history record(s) deleted successfully` });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;

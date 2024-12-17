const express = require('express');
const router = express.Router();
const fuelRecord = require('../models/fuelRecords'); // Ensure the path to your model is correct
const multer = require('multer');

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});

// Increase the maximum body size for POST requests (default is 100kb)
router.use(express.json({ limit: '100mb' })); // Allows 10MB request body
router.use(express.urlencoded({ limit: '100mb', extended: true })); // Allows 10MB form data

// 1. Create a new fuelRecord
router.post('/create', upload.single('picture'), async (req, res) => {
    try {
        const { truckName,coverage, date } = req.body;

        if (!truckName ||!coverage || !date) {
            return res.status(400).json({ message: 'coverage,truckName and date are required' });
        }

        const newfuelRecord = new fuelRecord({
            truckName,
            coverage,
            date,
            picture: req.file
                ? {
                      data: req.file.buffer,
                      contentType: req.file.mimetype,
                  }
                : undefined,
        });

        const savedRecord = await newfuelRecord.save();
        res.status(201).json(savedRecord); // Return the newly created record
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error creating record', error: error.message });
    }
});

// 2. Update a fuelRecord by fuelRecordsID
router.put('/update/:fuelRecordsID', upload.single('picture'), async (req, res) => {
    const { fuelRecordsID } = req.params;
    const { truckName,coverage, date } = req.body;

    try {
        if (!truckName ||!coverage || !date) {
            return res.status(400).json({ message: 'coverage and date are required' });
        }

        const updateData = {
            truckName,
            coverage,
            date,
        };

        if (req.file) {
            updateData.picture = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        const updatedRecord = await fuelRecord.findOneAndUpdate(
            { fuelRecordsID }, // Find the record by fuelRecordsID
            updateData, // Update the coverage and date
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedRecord) {
            return res.status(404).json({ message: 'Record not found for the provided fuelRecordsID' });
        }

        res.status(200).json(updatedRecord); // Return the updated record
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error updating record', error: error.message });
    }
});

// 3. Get all fuelRecords
router.get('/getAll', async (req, res) => {
    try {
        const records = await fuelRecord.find();

        const formattedRecords = records.map(record => ({
            ...record._doc,
            picture: record.picture
                ? `data:${record.picture.contentType};base64,${record.picture.data.toString('base64')}`
                : null,
        }));

        res.status(200).json(formattedRecords); // Return all records
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error fetching records', error: error.message });
    }
});

// 4. Delete a fuelRecord by fuelRecordsID
router.delete('/delete/:fuelRecordsID', async (req, res) => {
    const { fuelRecordsID } = req.params;

    try {
        const deletedRecord = await fuelRecord.findOneAndDelete({ fuelRecordsID });

        if (!deletedRecord) {
            return res.status(404).json({ message: 'Record not found for the provided fuelRecordsID' });
        }

        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error deleting record', error: error.message });
    }
});

module.exports = router;

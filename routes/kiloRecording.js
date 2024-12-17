const express = require('express');
const router = express.Router();
const KiloRecord = require('../models/kiloRecordsForGarbages'); // Ensure the path to your model is correct
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

// 1. Create a new KiloRecord
router.post('/create', upload.single('picture'), async (req, res) => {
    try {
        const { truckName,kilo, date } = req.body;

        if (!truckName ||!kilo || !date) {
            return res.status(400).json({ message: 'Kilo,truckName and date are required' });
        }

        const newKiloRecord = new KiloRecord({
            truckName,
            kilo,
            date,
            picture: req.file
                ? {
                      data: req.file.buffer,
                      contentType: req.file.mimetype,
                  }
                : undefined,
        });

        const savedRecord = await newKiloRecord.save();
        res.status(201).json(savedRecord); // Return the newly created record
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error creating record', error: error.message });
    }
});

// 2. Update a KiloRecord by kiloRecordsID
router.put('/update/:kiloRecordsID', upload.single('picture'), async (req, res) => {
    const { kiloRecordsID } = req.params;
    const { truckName,kilo, date } = req.body;

    try {
        if (!truckName ||!kilo || !date) {
            return res.status(400).json({ message: 'Kilo and date are required' });
        }

        const updateData = {
            truckName,
            kilo,
            date,
        };

        if (req.file) {
            updateData.picture = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        const updatedRecord = await KiloRecord.findOneAndUpdate(
            { kiloRecordsID }, // Find the record by kiloRecordsID
            updateData, // Update the kilo and date
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedRecord) {
            return res.status(404).json({ message: 'Record not found for the provided kiloRecordsID' });
        }

        res.status(200).json(updatedRecord); // Return the updated record
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error updating record', error: error.message });
    }
});

// 3. Get all KiloRecords
router.get('/getAll', async (req, res) => {
    try {
        const records = await KiloRecord.find();

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

// 4. Delete a KiloRecord by kiloRecordsID
router.delete('/delete/:kiloRecordsID', async (req, res) => {
    const { kiloRecordsID } = req.params;

    try {
        const deletedRecord = await KiloRecord.findOneAndDelete({ kiloRecordsID });

        if (!deletedRecord) {
            return res.status(404).json({ message: 'Record not found for the provided kiloRecordsID' });
        }

        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error deleting record', error: error.message });
    }
});

module.exports = router;

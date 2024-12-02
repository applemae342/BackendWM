const express = require('express');
const router = express.Router();
const Announcement = require('../models/announcements'); // Make sure the path is correct

// 1. Create a new announcement
router.post('/create', async (req, res) => {
    try {
        const announcement = await Announcement.create(req.body);
        res.status(201).json(announcement); // 201 Created status
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});
//2. get all announcements
router.get('/getAll', async (req, res) => {
    try {
        const announcement = await Announcement .find({});
        res.status(200).json(announcement);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// 3. Update an announcement by ID
router.put('/update/:announcementsID', async (req, res) => {
    const { announcementsID } = req.params;
    const { announcementsTitle, announcementBody } = req.body;

    try {
        const updatedAnnouncement = await Announcement.findOneAndUpdate(
            { announcementsID },
            { announcementsTitle, announcementBody },
            { new: true } // Return the updated document
        );

        if (!updatedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json(updatedAnnouncement);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// 4. Delete an announcement by ID
router.delete('/delete/:announcementsID', async (req, res) => {
    const { announcementsID } = req.params;

    try {
        const deletedAnnouncement = await Announcement.findOneAndDelete({ announcementsID });

        if (!deletedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const kiloRecords = new mongoose.Schema({
    kiloRecordsID: {
        type: String,
        default: uuidv4, // Automatically generate UUID
        unique: true,
    },
    truckName: {
        type: String,
        required: [true, "Please enter truckName."],
    },
    kilo: {
        type: String,
        required: [true, "Please enter kilo."],
    },
    date: {
        type: Date,
        required: true,
    },
    picture: {
        data: {
            type: Buffer, // Binary data of the image
            required: false, // Optional field
        },
        contentType: {
            type: String, // MIME type (e.g., "image/jpeg", "image/png")
            required: false, // Optional field
        },
    },
});

const KiloRecord = mongoose.model('KiloRecord', kiloRecords);

module.exports = KiloRecord;

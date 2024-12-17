const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const fuelRecords = new mongoose.Schema({
   fuelRecordsID: {
        type: String,
        default: uuidv4, // Automatically generate UUID
        unique: true,
    },
    truckName: {
        type: String,
        required: [true, "Please enter truckName."],
    },
    coverage: {
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

const FuelRecord = mongoose.model('FuelRecord', fuelRecords);

module.exports = FuelRecord;

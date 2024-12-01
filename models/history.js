const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const historySchema = new mongoose.Schema({
  historyID: {
    type: String,
    default: uuidv4, // Automatically generate UUID
    unique: true
  },
  userName: {
    type: String,
    required: [true, "Please enter username."]
  },

  date: {
    type: Date,
    default: Date.now,  // Automatically stores the current date and time
    required: true
  },
  
  latitude: {
    type: Number,  // Store latitude
    required: [true, "Please provide latitude."]
  },

  longitude: {
    type: Number,  // Store longitude
    required: [true, "Please provide longitude."]
  },
});

const History = mongoose.model('History', historySchema);

module.exports = History;

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const SharingFlag = new mongoose.Schema({
  flagID: {
    type: String,
    default: uuidv4, // Automatically generate UUID
    unique: true
  },

  flagStatus: {
    type: String,
    required: [true, "Please enter flagStatus."]
  },

  userName: {
    type: String,
    required: [true, "Please enter username."]
  },

  latitude: {
    type: Number,  // Store latitude
    required: [true, "Please provide latitude."]
  },

  longitude: {
    type: Number,  // Store longitude
    required: [true, "Please provide longitude."]
  },
  userID: {
    type: String, // Change to String to match UUID format in User model
    required: [true, "Please enter a user ID"]
  }
});

const Flag = mongoose.model('Flag', SharingFlag);

module.exports = Flag;

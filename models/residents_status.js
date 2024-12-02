const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const residentStatusSchema = new mongoose.Schema({
  statusID: {
    type: String,
    default: uuidv4, // Automatically generate UUID
    unique: true
  },
  
  statusName: {
    type: String,
    enum: ["collected", "pending"], 
    required: [true, "Please enter a status name"]
  },

  userID: {
    type: String, // Change to String to match UUID format in User model
    ref: 'User',  // Reference the 'userId' field in User model
    required: [true, "Please enter a user ID"]
  }
});

const ResidentStatus = mongoose.model('ResidentStatus', residentStatusSchema);
module.exports = ResidentStatus;

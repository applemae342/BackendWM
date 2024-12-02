const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const announcementSchema = new mongoose.Schema({
  announcementsID: {
    type: String,
    default: uuidv4, // Automatically generate UUID
    unique: true
  },

  announcementsTitle: {
    type: String,
    required: [true, "Please enter an announcement title"]
  },
  
  announcementBody: {
    type: String,
    required: [true, "Please enter the announcement body"]
  },
  
  timeSubmitted: {
    type: Date,
    default: Date.now,  // Automatically stores the current date and time
    required: true
  },
  
  userID: {
    type: String, // Use String instead of ObjectId to match UUID in User schema
    ref: 'User',  // Reference to the User model
    required: [true, "Please enter a user ID"]
  }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;

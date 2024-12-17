const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const resetPasswordSchema = new mongoose.Schema({
    resetPassID: {
        type: String,
        default: uuidv4, // Automatically generate UUID
        unique: true,
    },
  reset: {
    type: String,
    required: [true, "Please enter route name."],
    enum: ["yes", "no"],
    default: "yes"
  },
  userID: {
    type: String, // Change to String to match UUID format in User model
    ref: 'User',  // Reference the 'userId' field in User model
    required: [true, "Please enter a user ID"]
  }
  
});

const ResetPass = mongoose.model('ResetPass', resetPasswordSchema);

module.exports = ResetPass;

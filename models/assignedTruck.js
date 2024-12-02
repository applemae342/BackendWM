const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const assignedTruckSchema = new mongoose.Schema({
    assignedTruckID: {
    type: String,
    default: uuidv4, // Automatically generate UUID
    unique: true
  },

  assignedTruck: {
    type: String,
    required: [true, "Please enter route name."],
    enum: ["Truck A", "Truck B", "Truck C"],
  },

  userID: {
    type: String, // Change to String to match UUID format in User model
    ref: 'User',  // Reference the 'userId' field in User model
    required: [true, "Please enter a user ID"]
  }
  
 
  
});

const AssignedTruck = mongoose.model('AssignedTruck', assignedTruckSchema);

module.exports = AssignedTruck;

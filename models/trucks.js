const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const truckSchema = new mongoose.Schema({
  truckId: {
    type: String,
    default: uuidv4, // Automatically generate UUID
    unique: true
  },
  plateNumber: {
    type: String,
    required: [true, "Please enter a plate nmuber"]
  },
  description: {
    type: String,
    required: [true, "Please enter a description"]
  },
  password: {
    type: String,
    required: [true, "Please enter a password"]
  },
  routesID: {
    type: String, // Change to String to match UUID format in User model
    ref: 'Routes',  // Reference the 'userId' field in User model
    required: [true, "Please enter a route ID"]
  }

  
});

// Hash the password before saving the user
truckSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Truck = mongoose.model('Truck', truckSchema);

module.exports = Truck;

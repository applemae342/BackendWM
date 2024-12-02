const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: uuidv4, // Automatically generate UUID
    unique: true
  },
  firstname: {
    type: String,
    required: [true, "Please enter a first name"]
  },
  lastname: {
    type: String,
    required: [true, "Please enter a last name"]
  },
  username: {
    type: String,
    required: [true, "Please enter a username"]
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please enter a password"]
  },
  contactNumber: {
    type: String,
    required: [true, "Please enter a contact number"]
  },
  address: {
    type: String,
    required: [true, "Please enter an address"]
  },
  role: {
    type: String,
    required: [true, "Please enter a role"],
    enum: ["resident", "admin", "collector"],
    default: "resident"
  },
  otp: {
    type: String,
    
},
otpSentAt: {
    type: Date,
}


  
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

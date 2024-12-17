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
    required: [true, "Please enter a username"],
    unique: true

  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [8, "Password must be at least 8 characters long."]
},


  contactNumber: {
    type: Number,
    required: [true, "Please enter a contact number"],
    unique: true,
    validate: {
        validator: function (v) {
            return /^\d{11}$/.test(v.toString()); // Converts the number to a string and checks for exactly 11 digits
        },
        message: "Contact number must be exactly 11 digits."
    }
},

  address: {
    type: String,
    required: [true, "Please enter an address"]
  },
  reset: {
    type: String,
    required: [true, "Please enter resett status."],
    enum: ["yes", "no"],
    default: "no"
  },

  
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

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const routesSchema = new mongoose.Schema({
  routesID: {
    type: String,
    default: uuidv4, // Automatically generate UUID
    unique: true
  },

  routeName: {
    type: String,
    required: [true, "Please enter route name."]
  },

  coveredPlaces: {
    type: String,
    required: [true, "Please enter covered places."]
  },
 
  
});

const Routes = mongoose.model('Routes', routesSchema);

module.exports = Routes;

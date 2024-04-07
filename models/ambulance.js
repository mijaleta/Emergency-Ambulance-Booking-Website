// Ambulance.js
const mongoose = require('mongoose');
const ambulanceSchema = new mongoose.Schema({
  type: { type: String, required: true },
  available: { type: Number, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to User model

});
module.exports = mongoose.model('Ambulance', ambulanceSchema);

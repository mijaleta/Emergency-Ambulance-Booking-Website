// Ambulance.js

const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  type: { type: String, required: true },
  available: { type: Number, required: true }
});

module.exports = mongoose.model('Ambulance', ambulanceSchema);

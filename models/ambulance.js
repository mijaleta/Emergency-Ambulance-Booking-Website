const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  type: { type: String, required: true },
  available: { type: Number, required: true },
  archived: { type: Boolean, default: false } // Default value is false
});
module.exports = mongoose.model('Ambulance', ambulanceSchema);

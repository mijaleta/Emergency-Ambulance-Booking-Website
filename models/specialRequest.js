// models/SpecialRequest.js
const mongoose = require('mongoose');

const specialRequestSchema = new mongoose.Schema({
  requestText: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('SpecialRequest', specialRequestSchema);
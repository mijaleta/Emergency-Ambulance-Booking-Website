const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    contactNumber: String,
    feedbackType: [String], // Changed from [Boolean] to [String]
    feedbackText: String,
  });
  module.exports = mongoose.model('Feedback', feedbackSchema);

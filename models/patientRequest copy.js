// models/BookingRequest.js

const mongoose = require('mongoose');

const bookingRequestSchema = new mongoose.Schema({
    location: { type: String, required: false },
    contactInfo: { type: String, required: true },
    urgencyLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
    status: { type: Boolean, default: false } ,// New field for archiving
    createdAt: { type: Date, default: Date.now },
    archived: { type: Boolean, default: false } // New field for archiving
});

module.exports = mongoose.model('BookingRequest', bookingRequestSchema);
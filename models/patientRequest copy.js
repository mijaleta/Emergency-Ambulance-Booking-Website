// models/BookingRequest.js

const mongoose = require('mongoose');
const bookingRequestSchema = new mongoose.Schema({
    location: { type: String, required: true },
    contactInfo: { type: String, required: true },
    urgencyLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
    status: { type: String, enum: ['pending', 'dispatched', 'completed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    dispatcher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to dispatcher

});
module.exports = mongoose.model('BookingRequest', bookingRequestSchema);

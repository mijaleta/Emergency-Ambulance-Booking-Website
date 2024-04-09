// models/Booking.js

const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    // bookingRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'BookingRequest', required: true }, // Reference to BookingRequest model
    ambulance: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance', required: true }, // Reference to Ambulance model
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model (driver)
    nurse: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model (nurse)
    pickupTime: { type: Date }, // Time when the ambulance is scheduled to pick up the patient
    createdAt: { type: Date, default: Date.now } // Timestamp when the booking is created
});

module.exports = mongoose.model('Schedule', scheduleSchema);

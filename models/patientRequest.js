
// models/BookingRequest.js

const mongoose = require('mongoose');

const bookingRequestSchema = new mongoose.Schema({
patient_name: { type: String, required: true },
    location: { type: String, required: false },
    contactInfo: { type: String, required: true },
    address: { type: String, required: true },
    emergency_type: { type: String, enum: ['Animal', 'Labour', 'Car'], required: true },
    number:{type: Number,  default: 0,},
    level: { type:String, default: 'low' } ,// New field for archiving
    ambulanceType: { type: String, default: 'Basic' }, // New field to store ambulance type
    status: { type: Boolean, default: false } ,// New field for archiving
    createdAt: { type: Date, default: Date.now },
    archived: { type: Boolean, default: false }, // New field for archiving
    
});

module.exports = mongoose.model('BookingRequest', bookingRequestSchema);

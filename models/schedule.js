const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    ambulance: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nurse: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickupTime: { type: Date },
    createdAt: { type: Date, default: Date.now }, // Timestamp when the booking is created
    status: { type: Boolean, default: false }, // Adding the status field with default value of true
    dayOfWeek: { type: String, required: true }, // Adding the dayOfWeek field to store the selected day of the week
    shift: { type: String, enum: ['Day', 'Night'], required: true } // Shift: Day or Night

});

module.exports = mongoose.model('Schedule', scheduleSchema);

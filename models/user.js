const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/ambulance-website', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Successfully connected to MongoDB.'))
.catch(err => console.error('Connection error:', err));


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  mobile_number:{type:Number,required:true},
  role: {
    type: String,
    enum: ['admin', 'nurse', 'driver', 'dispatcher'],
    required: true
  },
  fcmTokens: {
    type: [String], // Changed to an array of strings
    default: []
  },


  resetPasswordToken: String,
  resetPasswordExpires: Date,
  passwordChanged: { type: Boolean, default: false } // New field to track password change
});

module.exports = mongoose.model('User', userSchema);

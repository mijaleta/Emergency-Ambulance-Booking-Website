const mongoose= require('mongoose')
const Contact = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String
});

// Create a model for the form data
module.exports  = mongoose.model('Contact', Contact);


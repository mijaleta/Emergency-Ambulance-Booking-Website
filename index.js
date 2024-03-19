// Import required modules
const express = require('express');
const { request } = require('http');
const mongoose = require('mongoose');
const path = require('path');
const Users = require('./models/user')
const indexRouter = require('./routes/index')
// Initialize Express app
const app = express();

// app.use('/users', usersRouter);


// Set up static files serving from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up views rendering
app.set('views', [
    path.join(__dirname, 'views', 'dispatcher'),
    path.join(__dirname, 'views', 'admin'),
    path.join(__dirname, 'views', 'home')

  ]);
app.set('view engine', 'ejs'); // Assuming you're using EJS as the template engine
app.use('/', indexRouter);

// for authentication






// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

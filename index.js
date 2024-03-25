// Import required modules
const express = require('express');
const bcrypt = require('bcrypt');
const { request } = require('http');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const User = require('./models/user')
const bodyParser = require('body-parser')
const indexRouter = require('./routes/index')
const LocalStrategy = require('passport-local').Strategy;
// Initialize Express app
const app = express();

app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html', 'js', 'mjs'] // Include .mjs extension
}));
app.set('views', [
    path.join(__dirname, 'views', 'dispatcher'),
    path.join(__dirname, 'views', 'admin'),
    path.join(__dirname, 'views', 'home')
  ]);
app.set('view engine', 'ejs'); // Assuming you're using EJS as the template engine

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Session middleware
app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
}));
// Configure flash middleware
app.use(flash());
// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Define local strategy
passport.use(new LocalStrategy(
  async function (username, password, done) {
      try {
          const user = await User.findOne({ username });
          if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
              return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
      } catch (error) {
          return done(error);
      }
  }
));
// Serialize and deserialize user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
      const user = await User.findById(id);
      done(null, user);
  } catch (error) {
      done(error);
  }
});
app.use('/', indexRouter);
// for authentication
// Start the server


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose')
const {isAdmin,isDispatcher} = require('../controllers/createadmin');
const nodemailer = require('nodemailer')
const router = express.Router();
const User = require('../models/user')
const Ambulance = require('../models/ambulance')
const BookingRequest = require('../models/patientRequest');
const crypto = require('crypto')
const bcrypt = require('bcrypt')

// for authentication 
router.get('/login', (req, res) => {
res.render('login'); // Renders the index view
});

// login route
router.post('/login', passport.authenticate('local'), (req, res) => {
    if (req.user) {
      if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
        // API request from mobile app
        res.json({
          success: true,
          message: 'Authentication successful',
          user: {
            username: req.user.username,
            role: req.user.role
          }
        });
      } else {
        // Web request
        res.redirect('/dashboard');
      }
    } else {
      if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
        // API request from mobile app
        res.status(401).json({ success: false, message: 'Authentication failed' });
      } else {
        // Web request
        res.redirect('/login');
      }
    }
  });
  router.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) {
      if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
        // API request from mobile app
        res.status(401).json({ success: false, message: 'Unauthorized' });
      } else {
        // Web request
        res.redirect('/login'); // Redirect to login if not authenticated
      }
    } else {
      const userRole = req.user.role;
      if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
        // API request from mobile app
        res.json({
          success: true,
          message: 'Authenticated',
          user: {
            username: req.user.username,
            role: req.user.role
          }
        });
      } else {
        // Web request
        switch (userRole) {
          case 'admin':
            res.render('adminDashboard', { username: req.user.username }); // Render admin dashboard template
            break;
          case 'nurse':
            res.render('nurseDashboard', { username: req.user.username }); // Render nurse dashboard template
            break;
          case 'driver':
            res.render('driverDashboard', { username: req.user.username }); // Render driver dashboard template
            break;
          case 'dispatcher':
            res.render('dispatcherDashboard', { username: req.user.username }); // Render dispatcher dashboard template
            break;
          default:
            res.status(403).send('Unauthorized'); // Handle unauthorized access
        }
      }
    }
  });

router.get('/adminDashboard',(req, res) => {
    res.render('adminDashboard'); // Renders the index view
  });
  router.get('/adminAmbulance',(req, res) => {
    res.render('adminAmbulance'); // Renders the index view
  }); 
  router.get('/adminContact',(req, res) => {
    res.render('adminContact'); // Renders the index view
  });


  // Route to update user details
router.post('/updateUser', async (req, res) => {
  try {
      const { userId, name, mobile_number, username, email, role } = req.body;

      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).send('User not found');
      }

      // Update user details
      user.name = name;
      user.mobile_number = mobile_number;
      user.username = username;
      user.email = email;
      user.role = role;

      // Save the updated user
      await user.save();

      // Redirect to the appropriate dashboard based on the role
      if (role === 'dispatcher') {
          res.redirect('adminDispatcher');
      } else if (role === 'driver') {
          res.redirect('adminDriver');
      }
      else if (role === 'nurse') {
        res.redirect('adminNurse');
    }
      else {
          // Handle other roles if needed
          res.status(400).send('Invalid role');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


  // Route to fetch dispatcher users and render the table
// Route to fetch dispatcher users and render the table
router.get('/adminDispatcher', async (req, res) => {
  try {
    const dispatcherUsers = await User.find({ role: 'dispatcher' });
    res.render('adminDispatcher', { users: dispatcherUsers }); // Pass users to the template
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});



// Route to fetch nurse users and render the table
router.get('/adminNurse', async (req, res) => {
  try {
    const nurseUsers = await User.find({ role: 'nurse' });
    res.render('adminNurse', { users: nurseUsers });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Route to fetch driver users and render the table
router.get('/adminDriver', async (req, res) => {
  try {
    const driverUsers = await User.find({ role: 'driver' });
    res.render('adminDriver', { users: driverUsers });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});




  router.get('/adminMap',(req, res) => {
    res.render('adminMap'); // Renders the index view
  });
  router.get('/adminSettings',(req, res) => {
    res.render('adminSettings'); // Renders the index view
  });

// Route to handle updating user details
router.post('/updateUser', async (req, res) => {
  const { name, mobile_number, username, email, role } = req.body;

  try {
      // Find the user by username
      let user = await User.findOne({ username });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update user details
      user.name = name;
      user.mobile_number = mobile_number;
      user.email = email;
      user.role = role;

      // Save updated user
      await user.save();

      res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Route to delete a user
router.delete('/deleteUser/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

  







// for dispatcher
  router.get('/dispatcherDashboard', isDispatcher,(req, res) => {
    res.render('dispatcherDashboard'); // Renders the index view
  });

  router.get('/dispatcherContact',isDispatcher, (req, res) => {
    res.render('dispatcherContact'); // Renders the index view
  });
  router.get('/dispatcherDispatcher',isDispatcher, (req, res) => {
    res.render('dispatcherDispatcher'); // Renders the index view
  });
  router.get('/dispatcherMap',isDispatcher, (req, res) => {
    res.render('dispatcherMap'); // Renders the index view
  });
  router.get('/dispatcherSettings',isDispatcher, (req, res) => {
    res.render('dispatcherSettings'); // Renders the index view
  });




  router.post('/add-ambulance', async (req, res) => {
    try {
      const { type, available } = req.body;
      const ambulance = new Ambulance({ type, available });
      await ambulance.save();
      res.status(201).json({ message: 'Ambulance added successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Route to update an ambulance
router.post('/updateAmbulance', async (req, res) => {
  try {
      const { ambulanceId, type, available } = req.body;

      // Find the ambulance by ID and update its details
      const updatedAmbulance = await Ambulance.findByIdAndUpdate(ambulanceId, { type, available }, { new: true });

      // Send the updated ambulance object in the response
      res.redirect('dispatcherAmbulance')
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
  // retrieve ambulance data 
  // Route to fetch ambulance information
router.get('/dispatcherAmbulance', async (req, res) => {
  try {
    const ambulances = await Ambulance.find();
    res.render('dispatcherAmbulance', { ambulances }); // Render the ambulances using a template engine
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Route to delete an ambulance
router.delete('/deleteAmbulance/:ambulanceId', async (req, res) => {
  try {
      const ambulanceId = req.params.ambulanceId;
      await Ambulance.findByIdAndDelete(ambulanceId);
      res.sendStatus(200); // Send success status if deletion is successful
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});





   // Configure email transporter
   const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'miratuujaallataa@gmail.com',
      pass: 'pxgb aoed olkr sjuv',
    },
  });
  // // Express.js routes
  // Function to save admin user to the database
  // Route for user registration (accessible only to admin) isAdmin
  router.get('/register',  (req, res) => {
    res.render('register'); // Render registration form
  });
  
  
 // Route to handle user update form submission
// Route to handle user registration form submission
// isAdmin,
router.post('/register',  async (req, res) => {
  try {
    const { username, email, role, name, mobile_number} = req.body;

    if (!username || !email || !role || !mobile_number || !name) {
      return res.status(400).send('Please provide all required fields');
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const randomPassword = crypto.randomBytes(8).toString('hex'); // Generate random password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      name,
      mobile_number,
      passwordChanged: false,
    });

    await newUser.save();
    console.log(req.user);

    const changePasswordURL = `http://${req.headers.host}/change-password/${newUser._id}`;

    const mailOptions = {
      from: 'miratuujaallataa@gmail.com',
      to: email,
      subject: 'Password Change Required',
      text: `Please click the following link to change your password: ${changePasswordURL}`,
      html: `Please click the following link to change your password: <a href="${changePasswordURL}">${changePasswordURL}</a>`,
    };
    await transporter.sendMail(mailOptions);
    
    res.status(201).render('index');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }
});



// the following for the password reset 
router.get('/change-password/:userId', (req, res) => {
    const userId = req.params.userId;
    res.render('changePassword', { userId });
  });
  router.post('/change-password/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const { password, confirmPassword } = req.body;
  
      // Check if passwords match
      if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
      }
  
      // Find the user in the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
  
      // Update the user's password
      user.password = hashedPassword;
      user.passwordChanged = true;
      await user.save();
  
      res.status(200).send('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // reset password logic here
  // Route for handling forgot password request
  router.get('/forgot-password', (req, res) => {
    res.render('forgotPassword');
  });
  
// Route to handle forgot password form submission
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    // Generate a random token
    const token = crypto.randomBytes(20).toString('hex');
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // User not found with that email
      if (req.accepts('html')) {
        // Respond with a simple text message for web clients
        return res.status(404).send('User not found');
      } else {
        // Respond with JSON for API clients (e.g., mobile app)
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    }
    // Set the reset token and expiration time
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    // Save the user with the reset token
    await user.save();

    // Send email to the user with a link to reset password
    const resetPasswordURL = `http://${req.headers.host}/reset-password/${token}`;
    const mailOptions = {
      from: 'miratuujaallataa@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            resetPasswordURL + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    };
    await transporter.sendMail(mailOptions);

    if (req.accepts('html')) {
      // Redirect to a confirmation message for web clients
      res.send('Password reset email sent! Please check your inbox.');
    } else {
      // Respond with JSON for API clients (e.g., mobile app)
      res.json({ success: true, message: 'Password reset email sent!' });
    }
  } catch (error) {
    console.error('Error sending password reset email:', error);
    if (req.accepts('html')) {
      // Respond with a simple text message for web clients
      res.status(500).send('Internal Server Error');
    } else {
      // Respond with JSON for API clients (e.g., mobile app)
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
});


  
  // Route for handling password reset form
  router.get('/reset-password/:token', async (req, res) => {
    try {
      const token = req.params.token;
  
      // Find the user with the provided token
      const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
      if (!user) {
        // Token is invalid or has expired
        return res.status(400).send('Invalid or expired token');
      }
  
      // Render the reset password form
      res.render('resetPassword', { token });
    } catch (error) {
      console.error('Error rendering reset password form:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  router.post('/reset-password/:token', async (req, res) => {
    try {
      const token = req.params.token;
      const { password, confirmPassword } = req.body;
  
      // Check if passwords match
      if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
      }
  
      // Find the user with the provided token
      const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
      if (!user) {
        // Token is invalid or has expired
        return res.status(400).send('Invalid or expired token');
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
  
      // Update the user's password and remove the reset token
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      // Redirect to login page with success message
      res.render('login', { message: 'Your password has been reset successfully. Please log in with your new password.' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).send('Internal Server Error');
    }
  });










  // Route to Log out
  router.get('/logout', function(req, res) {
    req.logout(function(err) {
      if(err) {
        console.error('Error logging out:', err);
        return res.status(500).send('Internal server error');
      }
      // Redirect the user to the login page after successful logout
      res.redirect('/login');
    });
  });



  // POST a new booking request
// router.post('/patientRequest', async (req, res) => {
//   try {
//     const { location, contactInfo, urgencyLevel } = req.body;
//     const bookingRequest = new BookingRequest({
//       location,
//       contactInfo,
//       urgencyLevel
//     });
//     const savedRequest = await bookingRequest.save();
//     // Emit event to dispatcher dashboard
//     if (req.user && req.user.role === 'dispatcher') {
//       req.io.emit('new-booking', savedRequest);
//       console.log('New booking request emitted');
//     }
//     // Check if the request comes from a mobile device or app
//     const isMobileDevice = req.headers['user-agent'].toLowerCase().match(/mobile|android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/);
//     const isMobileApp = req.headers['x-requested-with'] === 'XMLHttpRequest'; // Custom header set by the mobile app

//     if (isMobileDevice || isMobileApp) {
//       // Respond with JSON data for mobile devices or apps
//       res.status(200).json({
//         message: 'Booking request submitted successfully',
//         data: {
//           bookingRequest: savedRequest.toObject(),
//           recommendation: urgencyLevel
//         }
//       });
//     } else {
//       // Render the appropriate recommendation page for web clients
//       switch (urgencyLevel) {
//         case 'low':
//           res.render('l ow_recommendation', { bookingRequest: savedRequest.toObject() });
//           break;
//         case 'medium':
//           res.render('medium_recommendation', { bookingRequest: savedRequest.toObject() });
//           break;
//         case 'high':
//           res.render('high_recommendation', { bookingRequest: savedRequest.toObject() });
//           break;
//         default:
//           res.status(400).send('Invalid urgency level');
//       }
//     }
//   } catch (error) {
//     console.error('Error submitting booking request:', error);
//     res.status(500).send('An internal server error occurred');
//   }
// });

// POST a new booking request

// POST a new booking request

// 



// router.post('/patientRequest', async (req, res) => {
//   try {
//     const { location, contactInfo, urgencyLevel } = req.body;
//     const bookingRequest = new BookingRequest({
//       location,
//       contactInfo,
//       urgencyLevel
//     });
//     const savedRequest = await bookingRequest.save();
//     res.status(200).json({
//       message: 'Booking request submitted successfully',
//       data: {
//         location,
//         contactInfo,
//         urgencyLevel
//       }
//     });
//   } catch (error) {
//     console.error('Error submitting booking request:', error);
//     res.status(500).send('An internal server error occurred');
//   }
// });




// Save a notification when a booking request is created
router.post('/patientRequest', async (req, res) => {
  try {
    const { location, contactInfo, urgencyLevel } = req.body;
    const bookingRequest = new BookingRequest({
      location,
      contactInfo,
      urgencyLevel,
    });
    const savedRequest = await bookingRequest.save();
    res.status(200).json({
      message: 'Booking request submitted successfully',
      data: savedRequest
    });
  } catch (error) {
    console.error('Error submitting booking request:', error);
    res.status(500).send('An internal server error occurred');
  }
});

// for firebase notification 
// var admin = require("firebase-admin");
// var serviceAccount = require("../env/ambulancebooking-812cd-firebase-adminsdk-nlrl0-62836b8b07.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });






module.exports = router;

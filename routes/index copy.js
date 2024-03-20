const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose')
const {isAdmin,isDispatcher} = require('../controllers/createadmin');
const nodemailer = require('nodemailer')
const router = express.Router();
const User = require('../models/user')
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


  // Route to fetch dispatcher users and render the table
router.get('/adminDispatcher', async (req, res) => {
  try {
    const dispatcherUsers = await User.find({ role: 'dispatcher' });
    res.render('adminDispatcher', { users: dispatcherUsers });
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


router.post('/updateUser', async (req, res) => {
  try {
      const { name, mobile_number, username, email, role } = req.body;

      // Find the user with role 'dispatcher'
      const user = await User.findOne({ role: 'dispatcher' });

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

      // Render the updated user data back to the frontend
      res.render('adminDispatcher', { user: user });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


  router.get('/adminMap',(req, res) => {
    res.render('adminMap'); // Renders the index view
  });
  router.get('/adminSettings',(req, res) => {
    res.render('adminSettings'); // Renders the index view
  });



  // Route to display the form with user details for updating
router.get('/adminDispatcher/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Render the form with the user's data
    res.render('adminDispatcher', { user }); // Replace 'editUserForm' with your actual form template name
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('An error occurred while fetching the user');
  }
});

// Route to handle the form submission for updating a user
router.post('/updateUser', async (req, res) => {
  try {
    // Find the user by their username and update their details
    const updatedUser = await User.findOneAndUpdate(
      { username: req.body.username }, // Find user by username
      {
        name: req.body.name,
        mobile_number: req.body.mobile_number,
        email: req.body.email,
        role: req.body.role,
        username:req.body.username
        // Include other fields you want to update
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    // Redirect to the user profile page or send a success response
    res.redirect('/userProfile'); // Replace with the path to your user profile page
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('An error occurred while updating the user');
  }
});

  







// for dispatcher
  router.get('/dispatcherDashboard', isDispatcher,(req, res) => {
    res.render('dispatcherDashboard'); // Renders the index view
  });
  router.get('/dispatcherAmbulance', isDispatcher,(req, res) => {
    res.render('dispatcherAmbulance'); // Renders the index view
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
  // Route for user registration (accessible only to admin)
  router.get('/register', isAdmin, (req, res) => {
    res.render('register'); // Render registration form
  });
  
  
 // Route to handle user update form submission




  // Read (List all users)
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.render('userList', { users }); // Render user list page with users data
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update (Get user by ID and render edit form)
router.get('/edit/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('editUser', { user }); // Render user edit page with user data
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update (Handle user edit form submission)
router.post('/edit/:id', isAdmin, async (req, res) => {
  try {
    const { username, email, role } = req.body;
    await User.findByIdAndUpdate(req.params.id, {
      username,
      email,
      role,
      passwordChanged: false // Reset passwordChanged flag
    });
    res.redirect('/users'); // Redirect to user list page
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete (Remove user by ID)
router.get('/delete/:id', isAdmin, async (req, res) => {
  try {
    // Attempt to find and delete the user by ID
    await User.findOneAndDelete({ _id: req.params.id });
    // Redirect to the user list page after successful deletion
    res.redirect('/users');
  } catch (error) {
    console.error('Error deleting user:', error);
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

module.exports = router;

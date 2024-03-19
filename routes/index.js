const express = require('express');
const passport = require('passport');
const {isAdmin,isDispatcher} = require('../controllers/createadmin');
const nodemailer = require('nodemailer')
const router = express.Router();
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




router.get('/', (req, res) => {
  res.render('indexindex'); // Renders the index view
});
router.get('/adminDashboard', (req, res) => {
    res.render('adminDashboard'); // Renders the index view
  });
  router.get('/adminAmbulance', (req, res) => {
    res.render('adminAmbulance'); // Renders the index view
  });
  router.get('/adminNurse', (req, res) => {
    res.render('adminNurse'); // Renders the index view
  });  
  router.get('/adminDriver', (req, res) => {
    res.render('adminDriver'); // Renders the index view
  });  
  router.get('/adminContact', (req, res) => {
    res.render('adminContact'); // Renders the index view
  });
  router.get('/adminDispacher', (req, res) => {
    res.render('adminDispacher'); // Renders the index view
  });
  router.get('/adminMap', (req, res) => {
    res.render('adminMap'); // Renders the index view
  });
  router.get('/adminSettings', (req, res) => {
    res.render('adminSettings'); // Renders the index view
  });
  router.get('/adminIndex', (req, res) => {
    res.render('adminIndex'); // Renders the index view
  });
router.get('/adminContact', (req, res) => {
    res.render('adminContact'); // Renders the index view
  });







// for dispatcher
  router.get('/dispatcherDashboard', (req, res) => {
    res.render('dispatcherDashboard'); // Renders the index view
  });
  router.get('/dispatcherAmbulance', (req, res) => {
    res.render('dispatcherAmbulance'); // Renders the index view
  });
  router.get('/dispatcherContact', (req, res) => {
    res.render('dispatcherContact'); // Renders the index view
  });
  router.get('/dispatcherDispacher', (req, res) => {
    res.render('dispatcherDispacher'); // Renders the index view
  });
  router.get('/dispatcherMap', (req, res) => {
    res.render('dispatcherMap'); // Renders the index view
  });
  router.get('/dispatcherSettings', (req, res) => {
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
  
  
  // Route to handle user registration form submission
  router.post('/register', isAdmin, async (req, res) => {
    try {
      const { username, email, role } = req.body;
  
      if (!username || !email || !role) {
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



module.exports = router;

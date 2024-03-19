const express = require('express');
const passport = require('passport');

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







module.exports = router;

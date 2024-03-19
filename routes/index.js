const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('indexindex'); // Renders the index view
});
router.get('/adminDashboard', (req, res) => {
    res.render('adminDashboard'); // Renders the index view
  });

  router.get('/adminAmbulance', (req, res) => {
    res.render('adminAmbulance'); // Renders the index view
  });
  router.get('/admiNurse', (req, res) => {
    res.render('admiNurse'); // Renders the index view
  });
  
  router.get('/adminNurse', (req, res) => {
    res.render('adminNurse'); // Renders the index view
  });  
  
  router.get('/adminContact', (req, res) => {
    res.render('adminContact'); // Renders the index view
  });

  router.get('/adminDispacher', (req, res) => {
    res.render('adminDispacher'); // Renders the index view
  });

  
  
  router.get('/adminIndex', (req, res) => {
    res.render('adminIndex'); // Renders the index view
  });

  
router.get('/contact', (req, res) => {
    res.render('contact'); // Renders the index view
  });

module.exports = router;

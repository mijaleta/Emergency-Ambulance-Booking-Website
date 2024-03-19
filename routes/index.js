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

module.exports = router;

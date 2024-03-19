const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('indexindex'); // Renders the index view
});
router.get('/contact', (req, res) => {
    res.render('contact'); // Renders the index view
  });

module.exports = router;

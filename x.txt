const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index'); // Renders the index view
});

module.exports = router;

var express = require('express');
var router = express.Router();

router.get('/register', function(req, res, next) {
  console.log()
  res.render('register.ejs');
});

module.exports = router;
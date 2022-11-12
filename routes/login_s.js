var express = require('express');
var router = express.Router();


router.post('/login', function(req, res, next) {
  res.render('login_sScreen.ejs');
});

module.exports = router;

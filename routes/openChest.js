var express = require('express');
var router = express.Router();

router.get('/openChest', function(req, res, next) {
  console.log()
  res.render('login_sScreen.ejs');
});

module.exports = router;
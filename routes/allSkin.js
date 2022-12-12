var express = require('express');
var router = express.Router();

router.get('/allSkin', function(req, res, next) {
  res.render('allSkin.ejs');
});

module.exports = router;
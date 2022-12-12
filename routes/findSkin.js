var express = require('express');
var router = express.Router();


router.post('/findSkin', function(req, res, next) {
  res.render('allSkin.ejs');
});

module.exports = router;
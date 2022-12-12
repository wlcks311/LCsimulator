var express = require('express');
var router = express.Router();

router.get('/showLV3', function(req, res, next) {
  console.log()
  res.render('allSkin.ejs');
});

module.exports = router;
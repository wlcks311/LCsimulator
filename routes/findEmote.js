var express = require('express');
var router = express.Router();


router.post('/findEmote', function(req, res, next) {
  res.render('allEmote.ejs');
});

module.exports = router;
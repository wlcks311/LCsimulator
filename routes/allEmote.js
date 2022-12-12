var express = require('express');
var router = express.Router();

router.get('/allEmote', function(req, res, next) {
  res.render('allEmote.ejs');
});

module.exports = router;
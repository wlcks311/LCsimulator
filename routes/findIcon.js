var express = require('express');
var router = express.Router();


router.post('/findIcon', function(req, res, next) {
  res.render('allIcon.ejs');
});

module.exports = router;
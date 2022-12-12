var express = require('express');
var router = express.Router();

router.get('/allIcon', function(req, res, next) {
  res.render('allIcon.ejs');
});

module.exports = router;
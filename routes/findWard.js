var express = require('express');
var router = express.Router();


router.post('/findWard', function(req, res, next) {
  res.render('allWard.ejs');
});

module.exports = router;
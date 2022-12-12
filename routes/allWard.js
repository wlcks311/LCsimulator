var express = require('express');
var router = express.Router();

router.get('/allWard', function(req, res, next) {
  res.render('allWard.ejs');
});

module.exports = router;
var express = require('express');
var router = express.Router();


router.post('/findUser', function(req, res, next) {
  res.render('searchResult.ejs');
});

module.exports = router;
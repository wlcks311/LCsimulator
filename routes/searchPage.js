var express = require('express');
var router = express.Router();

router.get('/searchPage', function(req, res, next) {
  res.render('searchPage.ejs');
});

module.exports = router;
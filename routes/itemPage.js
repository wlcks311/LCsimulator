var express = require('express');
var router = express.Router();

router.get('/itemPage', function(req, res, next) {
  res.render('itemPage.ejs');
});

module.exports = router;
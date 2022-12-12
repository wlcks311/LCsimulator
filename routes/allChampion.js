var express = require('express');
var router = express.Router();

router.get('/allChampion', function(req, res, next) {
  res.render('allChampion.ejs');
});

module.exports = router;
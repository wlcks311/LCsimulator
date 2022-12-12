var express = require('express');
var router = express.Router();


router.post('/findChampion', function(req, res, next) {
  res.render('allChampion.ejs');
});

module.exports = router;
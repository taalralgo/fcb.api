var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Fuck beach. Permission denied')
});

module.exports = router;

var express = require('express');
var router = express.Router();
const { exec } = require('child_process');

router.get('/', function(req,res,next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

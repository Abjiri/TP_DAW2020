var express = require('express');
var router = express.Router();

var axios = require('axios');

var aux = require('./functions')

router.get('/', function(req, res) {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else aux.renderHome(req.cookies.token, res, {})
});

module.exports = router;

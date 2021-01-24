var express = require('express');
var router = express.Router();

var axios = require('axios');

router.get('/', function(req, res) {
  if (req.cookies.token) {
    axios.get('http://localhost:8001/publicacoes?token=' + req.cookies.token)
      .then(dados => res.render('home', {auth: true, publicacoes: dados.data}))
      .catch(error => res.render('error', {error}))
  }
  else res.render('home', {auth: req.cookies.token ? true : false});
});

module.exports = router;

var express = require('express');
var router = express.Router();

var axios = require('axios');

var aux = require('./functions')

router.get('/', function(req, res) {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    axios.get('http://localhost:8001/noticias?token=' + req.cookies.token)
      .then(dados => {
        var token = aux.unveilToken(req.cookies.token)
        res.render('home', {nivel: token.nivel, noticias: dados.data})
      })
      .catch(error => res.render('error', {error}))
  }
});

module.exports = router;

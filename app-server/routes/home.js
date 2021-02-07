var express = require('express');
var router = express.Router();

var axios = require('axios');
var moment = require('moment')

var aux = require('./functions')

router.get('/', function(req, res) {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else aux.renderHome(req.cookies.token, res, {})
});

router.get('/users', function(req, res) {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    var token = aux.unveilToken(req.cookies.token)
    axios.get('http://localhost:8001/users/?token=' + req.cookies.token)
      .then(dados => {
        dados.data.forEach(u => {
          u.dataRegisto = moment(u.dataRegisto).format('DD-MM-YYYY')
        })
        res.render('users', {nivel: token.nivel, users: dados.data})
      })  
      .catch(error => res.render('error', {error}))
  }
});

module.exports = router;

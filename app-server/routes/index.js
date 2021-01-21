var express = require('express');
var router = express.Router();

var axios = require('axios');

router.get('/', function(req, res) {
  res.render('index', {auth: req.cookies.token ? true : false});
});

router.get('/recursos', function(req, res) {
  if (!req.cookies.token) res.redirect('/users/login')
  else {
    axios.get('http://localhost:8001/recursos?token=' + req.cookies.token)
      .then(dados => res.render('recursos', {lista: dados.data, auth: true}))
      .catch(error => res.render('error', {error}))
  }
})

module.exports = router;

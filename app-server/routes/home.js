var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: './uploads'});

var axios = require('axios');

router.get('/', function(req, res) {
  if (req.cookies.token) {
    axios.get('http://localhost:8001/publicacoes?token=' + req.cookies.token)
      .then(dados => {console.log(dados.data); res.render('home', {auth: true, publicacoes: dados.data})})
      .catch(error => res.render('error', {error}))
  }
  else res.render('home', {auth: req.cookies.token ? true : false});
});

router.get('/recursos', function(req, res) {
  if (!req.cookies.token) res.redirect('/users/login')
  else {
    axios.get('http://localhost:8001/recursos?token=' + req.cookies.token)
      .then(dados => res.render('recursos', {lista: dados.data, auth: true}))
      .catch(error => res.render('error', {error}))
  }
})

router.post('/recursos/upload', function(req, res) {
  if (!req.cookies.token) res.redirect('/users/login')
  else {
    axios.get('http://localhost:8001/recursos?token=' + req.cookies.token)
      .then(dados => res.render('recursos', {lista: dados.data, auth: true}))
      .catch(error => res.render('error', {error}))
  }
})

module.exports = router;

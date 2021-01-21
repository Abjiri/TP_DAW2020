var axios = require('axios');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {auth: req.cookies.token ? true : false});
});

router.get('/login', function(req, res) {
  res.render('login');
})

router.get('/signup', function(req, res) {
  res.render('signup');
})

router.post('/login', function(req, res) {
  axios.post('http://localhost:8000/users/login', req.body)
    .then(dados => {
      if (dados.data.token) {
        res.cookie('token', dados.data.token, {
          expires: new Date(Date.now() + '1d'),
          secure: false,
          httpOnly: true
        })

        res.redirect('/recursos')
      }
      else res.render('error', {error: 'Dados inválidos'})
    })
    .catch(error => res.render('error', {error}))
})

router.get('/recursos', function(req, res) {
  if (!req.cookies.token) res.redirect('login')
  else {
    axios.get('http://localhost:8001/recursos?token=' + req.cookies.token)
      .then(dados => res.render('recursos', {lista: dados.data, auth: true}))
      .catch(error => res.render('error', {error}))
  }
})

module.exports = router;

var express = require('express');
var router = express.Router();

var axios = require('axios');

router.get('/login', function(req, res) {
  res.render('login');
})

router.get('/signup', function(req, res) {
  res.render('signup');
})

router.get('/logout', function(req, res) {
  res.clearCookie("token");
  res.redirect('/');
})

router.post('/login', function(req, res) {
  axios.post('http://localhost:8000/users/login', req.body)
    .then(dados => {
      console.log(dados.data)
      if (dados.data.success) {
        res.cookie('token', dados.data.token, {
          expires: new Date(Date.now() + '1d'),
          secure: false,
          httpOnly: true
        })

        res.redirect('/recursos')
      }
      else res.render('index', {
        auth: false,
        invalidInput: dados.data.invalidInput,
        email: req.body.email,
        password: req.body.password,
        error_msg: dados.data.error
      })
    })
    .catch(error => res.render('error', {error}))
})

module.exports = router;

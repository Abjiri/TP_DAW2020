var express = require('express');
var router = express.Router();

var axios = require('axios');

router.get('/logout', function(req, res) {
  res.clearCookie("token");
  res.redirect(req.headers.referer);
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

        res.redirect(req.headers.referer)
      }
      else res.render('home', {
        nivel: 'consumidor',
        invalidLField: dados.data.invalidInput,
        ...req.body,
        error_msg: dados.data.error
      })
    })
    .catch(error => res.render('error', {error}))
})

router.post('/signup', function(req, res) {
  if (req.body.password != req.body.password_again) 
    res.render('home', {
      nivel: 'consumidor',
      invalidSField: "password",
      ...req.body,
      error_msg: "As passwords não coincidem!"
    })

  else {
    axios.post('http://localhost:8000/users/signup', req.body)
      .then(dados => {
        if (dados.data.token) {
          res.cookie('token', dados.data.token, {
            expires: new Date(Date.now() + '1d'),
            secure: false,
            httpOnly: true
          })

          res.redirect(req.headers.referer)
        }
        else res.render('home', {
          nivel: 'consumidor',
          invalidSField: dados.data.invalidInput,
          ...req.body,
          error_msg: dados.data.error
        })
      })
      .catch(error => res.render('error', {error}))
  }
})

module.exports = router;

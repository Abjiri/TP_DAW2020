var express = require('express');
var router = express.Router();
var aux = require('./functions')

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

        if (req.headers.referer == 'http://localhost:8002/users/login') res.redirect('/')
          else res.redirect(req.headers.referer)
      }
      else {
        aux.renderHome(req.cookies.token, res, {
          invalidLField: dados.data.invalidInput,
          ...req.body,
          error_msg: dados.data.error
        })
      }
    })
    .catch(error => res.render('error', {error}))
})

router.post('/signup', function(req, res) {
  if (req.body.password != req.body.password_again) {
    aux.renderHome(req.cookies.token, res, {
      invalidSField: "password",
      ...req.body,
      error_msg: "As passwords não coincidem!"
    })
  }

  else {
    axios.post('http://localhost:8000/users/signup', req.body)
      .then(dados => {
        if (dados.data.token) {
          res.cookie('token', dados.data.token, {
            expires: new Date(Date.now() + '1d'),
            secure: false,
            httpOnly: true
          })

          if (req.headers.referer == 'http://localhost:8002/users/signup') res.redirect('/')
          else res.redirect(req.headers.referer)
        }
        else {
          aux.renderHome(req.cookies.token, res, {
            invalidSField: dados.data.invalidInput,
            ...req.body,
            error_msg: dados.data.error
          })
        }
      })
      .catch(error => res.render('error', {error}))
  }
})

router.delete('/:id',function(req,res){
  if (!req.cookies.token) res.render('error', {error})
  else {
    var token = aux.unveilToken(req.cookies.token)
    if(token.nivel == 'admin') {
      axios.delete('http://localhost:8001/users/' + req.params.id + '?token=' + req.cookies.token)
        .then(dados => {
          res.redirect("/home")
        })
        .catch(error => res.render('error', {error}))
    }
    else {
      res.render('error', {error})
    }
  }
})

module.exports = router;

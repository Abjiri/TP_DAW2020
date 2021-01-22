var jwt = require('jsonwebtoken');
var passport = require('passport');
var express = require('express');
var router = express.Router();

var User = require('../controllers/user');

// listar utilizadores
router.get('/', function(req, res, next) {
  User.listar()
    .then(dados => res.status(200).jsonp({users: dados}))
    .catch(error => res.status(500).jsonp({error}))
});

// inserir novo utilizador
router.post('/', function(req, res) {
  User.inserir(req.body)
    .then(dados => res.status(201).jsonp({dados}))
    .catch(error => res.status(500).jsonp({error}))
})

// login de utilizador
router.post('/login', passport.authenticate('local'), function(req, res) {
  console.log("XD LOGIN " + JSON.stringify(req.user))
  if (req.user.success) {
    jwt.sign({
      email: req.user.email, 
      nivel: req.user.nivel,
      _id: req.user._id,
      sub: 'TP_DAW2020'}, 
      "TP_DAW2020",
      {expiresIn: "1d"},
      function(e, token) {
        jwt.verify(token,"TP_DAW2020",function(e,decoded){
          if(e){
            console.log('Erro: ' + e)
            t = null
          }
          else{
            console.log("Decode: " + JSON.stringify(decoded))
          } 
        })
        if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
        else res.status(201).jsonp({token})
    })
  }
  else res.status(201).jsonp({invalidInput: req.user.invalidInput, error: req.user.message}) 
})

module.exports = router;

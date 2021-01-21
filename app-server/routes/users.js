var express = require('express');
var router = express.Router();

var axios = require('axios')
var jwt = require('jsonwebtoken')
var keyToken = "TP_DAW2020"

function unveilToken(token){  
  var t = null;
  jwt.verify(token,keyToken,function(e,decoded){
    if(e){
      console.log('Erro: ' + e)
      t = null
    }
    else{
      return t = decoded
    } 
  })
  return t
}

/* GET users listing. */
router.get('/perfil', function(req, res, next) {
  if (!req.cookies.token) res.redirect('/users/login')
  else {
    var token = unveilToken(req.cookies.token)
    axios.get('http://localhost:8001/users/' + token._id +'?token=' + req.cookies.token)
      .then(dados => res.render("user", {user: dados.data}))
      .catch(error => res.render('error', {error}))
  }
});

router.post('/editar/:id', function(req, res, next){
  //req.cookies.token = req.query.token
  if (!req.cookies.token) res.redirect('/users/login')
  else {
    var token = unveilToken(req.cookies.token)
    axios.put('http://localhost:8001/users/' + token._id +'?token=' + req.cookies.token, req.body)
      .then(dados => res.redirect("/users/perfil"))
      .catch(error => res.render('error', {error}))
  }
})

module.exports = router;

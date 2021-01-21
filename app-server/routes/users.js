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
  if (!req.cookies.token) res.redirect('login')
  else {
    var token = unveilToken(req.cookies.token)
    console.log('http://localhost:8001/users/' + token.email +'?token=' + req.cookies.token)
    axios.get('http://localhost:8001/users/' + token.email +'?token=' + req.cookies.token)
      .then(dados => res.render("user", {user: dados.data}))
      .catch(error => res.render('error', {error}))
  }
});

router.post('/:id')

module.exports = router;

var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken')
var keyToken = "TP_DAW2020"

var axios = require('axios')
var multer = require('multer')

var storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, "./uploads/imagens/")
  },
  filename: (req,file,cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})
var upload = multer({storage: storage})


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
  console.log("DECODE: " + JSON.stringify(t))
  return t
}
  
router.get('/', function(req, res, next) {
    if (!req.cookies.token) res.redirect('/users/login')
    else {
        var token = unveilToken(req.cookies.token)
        console.log(token)
        res.redirect('/perfil/' + token._id)
    }
});
  
router.get('/:id', function(req, res, next) {
    axios.get('http://localhost:8001/users/' + req.params.id +'?token=' + req.cookies.token)
    .then(dados => res.render("profile", {user: dados.data}))
    .catch(error => res.render('error', {auth: true, error}))
})
  
router.post('/:id/editar', function(req, res, next){
    if (!req.cookies.token) res.redirect('/users/login')
    else {
      axios.put('http://localhost:8001/users/' + req.params.id +'?token=' + req.cookies.token, req.body)
        .then(dados => res.redirect("/perfil"))
        .catch(error => res.render('error', {auth: true, error}))
    }
})
  
router.post('/:id/editar/imagem/', upload.single('foto'), function(req,res,next){
    if (!req.cookies.token) res.redirect('/users/login')
    else {
      var token = unveilToken(req.cookies.token)
      axios.put('http://localhost:8001/users/' + req.params.id +'?token=' + req.cookies.token, {foto: req.file.path, _id: token._id})
        .then(dados => res.render("profile", {user: dados.data}))
        .catch(error => res.render('error', {error}))
    }
})

module.exports = router;
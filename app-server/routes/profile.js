var express = require('express');
var router = express.Router();

var axios = require('axios')
var multer = require('multer')

var func = require('./functions')
var moment = require('moment')

var storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, "public/images/")
  },
  filename: (req,file,cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})
var upload = multer({storage: storage})
  
router.get('/', function(req, res, next) {
    if (!req.cookies.token) res.redirect('/')
    else {
        var token = func.unveilToken(req.cookies.token)
        console.log(token)
        res.redirect('/perfil/' + token._id)
    }
});

router.get('/:id', function(req, res, next) {
  var token = func.unveilToken(req.cookies.token)
  axios.get('http://localhost:8001/publicacoes/autor/' + token._id +'?token=' + req.cookies.token)
    .then(publicacoes => {
      axios.get('http://localhost:8001/noticias/autor/' + token._id +'?token=' + req.cookies.token)
      .then(noticias => {
        axios.get('http://localhost:8001/users/' + req.params.id +'?token=' + req.cookies.token)
          .then(dados => res.render("profile", {auth: true, user: dados.data, owns: token._id == req.params.id, moment: moment, publicacoes: publicacoes.data, noticias: noticias.data}))
          .catch(error => res.render('error', {error}))
      })
      .catch(error => res.render('error', {error}))
    })
    .catch(error => res.render('error', {error}))
})
  
router.post('/:id/editar', function(req, res, next){
  var estatuto = {tipo: req.body.estatuto.charAt(0).toUpperCase() + req.body.estatuto.slice(1), filiacao: req.body.filiacao}
  var fixed = {_id: req.params.id, nome: req.body.nome, descricao: req.body.descricao, estatuto: estatuto}
    if (!req.cookies.token) res.redirect('/')
    else {
      axios.put('http://localhost:8001/users/' + req.params.id +'?token=' + req.cookies.token, fixed)
        .then(dados => res.redirect("/perfil"))
        .catch(error => res.render('error', {error}))
    }
})
  
router.post('/:id/editar/imagem/', upload.single('foto'), function(req,res,next){
  console.log(JSON.stringify(req.file))
    if (!req.cookies.token) res.redirect('/')
    else {
      var token = func.unveilToken(req.cookies.token)
      axios.put('http://localhost:8001/users/imagem/' + req.params.id +'?token=' + req.cookies.token, {foto: req.file.path.replace("public","").replace(/\\/g,"/"), _id: token._id})
        .then(dados => res.redirect("/perfil"))
        .catch(error => res.render('error', {error}))
    }
})

module.exports = router;
var express = require('express');
var router = express.Router();

var axios = require('axios')
var multer = require('multer')

var aux = require('./functions')
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
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    var token = aux.unveilToken(req.cookies.token)

    if (token._id) res.redirect('/perfil/' + token._id)
    else res.redirect('/')
  }
});

router.get('/:id', function(req, res, next) {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    var token = aux.unveilToken(req.cookies.token)

    axios.get('http://localhost:8001/publicacoes/autor/' + req.params.id +'?token=' + req.cookies.token)
      .then(publicacoes => {
        axios.get('http://localhost:8001/noticias/autor/' + req.params.id +'?token=' + req.cookies.token)
        .then(noticias => {
          axios.get('http://localhost:8001/users/' + req.params.id +'?token=' + req.cookies.token)
            .then(dados => res.render("profile", {
              nivel: token.nivel, 
              user: dados.data, 
              dono: token._id == req.params.id || token.nivel == 'admin', 
              moment, 
              timeline: aux.groupAndSortByDate(publicacoes.data,noticias.data)}))
            .catch(error => res.render('error', {nivel: 'consumidor', error}))
        })
        .catch(error => res.render('error', {nivel: 'consumidor', error}))
      })
      .catch(error => res.render('error', {nivel: 'consumidor', error}))
  }
})
  
router.post('/:id/editar', function(req, res, next){
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    var token = aux.unveilToken(req.cookies.token)

    if ((token.nivel == 'produtor' || token.nivel == 'admin') && token._id == req.params.id) {
      var estatuto = {tipo: req.body.estatuto.charAt(0).toUpperCase() + req.body.estatuto.slice(1), filiacao: req.body.filiacao}
      var fixed = {_id: req.params.id, nome: req.body.nome, descricao: req.body.descricao, estatuto}
      
      axios.put('http://localhost:8001/users/' + req.params.id +'?token=' + req.cookies.token, fixed)
        .then(dados => res.redirect("/perfil"))
        .catch(error => res.render('error', {nivel: 'consumidor', error}))
    }
    else res.redirect('/perfil/' + req.params.id)
  }
})
  
router.post('/:id/editar/imagem/', upload.single('foto'), function(req,res,next){
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    var token = aux.unveilToken(req.cookies.token)

    if ((token.nivel == 'produtor' || token.nivel == 'admin') && token._id == req.params.id) {
      var foto

      if (!req.file) foto = '/images/login_avatar.png'
      else foto = req.file.path.replace("public","").replace(/\\/g,"/")

      axios.put('http://localhost:8001/users/imagem/' + req.params.id +'?token=' + req.cookies.token, {foto: foto, _id: token._id})
        .then(d1 => {
          axios.post('http://localhost:8001/noticias/atualizarFoto/' + token._id + '?token=' + req.cookies.token, {foto: foto})
            .then(d2 => {
              axios.post('http://localhost:8001/publicacoes/atualizarFoto/' + token._id + '?token=' + req.cookies.token, {foto: foto})
                .then(d3 => res.redirect("/perfil"))
                .catch(error => res.render('error', {nivel: 'consumidor', error}))
            })
            .catch(error => res.render('error', {nivel: 'consumidor', error}))
        })
        .catch(error => res.render('error', {nivel: 'consumidor', error}))
    }
    else res.redirect('/perfil/' + req.params.id)
  }
})

router.get('*', function(req,res) {
  res.redirect('/')
})

module.exports = router;
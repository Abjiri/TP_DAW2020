var express = require('express');
var router = express.Router();

var axios = require('axios')
var multer = require('multer')

var func = require('./functions')

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
  axios.get('http://localhost:8001/users/' + req.params.id +'?token=' + req.cookies.token)
  .then(dados => {
    var token = func.unveilToken(req.cookies.token)

    console.log("user " + JSON.stringify(dados.data))
    res.render("profile", {auth: true, user: dados.data, owns: token._id == req.params.id}) // if the user owns the profile
  })
  .catch(error => res.render('error', {error}))
})
  
router.post('/:id/editar', function(req, res, next){
  var estatuto = {tipo: req.body.estatuto.charAt(0).toUpperCase() + req.body.estatuto.slice(1), filiacao: req.body.filiacao}
  var fixed = {foto:"public\\images\\1611331102678-35790963_2133156523380412_2419683625655074816_n.jpg",_id: req.params.id, nome: req.body.nome, descricao: req.body.descricao, estatuto: estatuto}
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
      axios.put('http://localhost:8001/users/imagem/' + req.params.id +'?token=' + req.cookies.token, {foto: req.file.path, _id: token._id})
        .then(dados => res.redirect("/perfil"))
        .catch(error => res.render('error', {error}))
    }
})

module.exports = router;
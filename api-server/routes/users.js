var express = require('express');
var router = express.Router();

const User = require('../controllers/user')

// Listar todos os utilizadores
router.get('/', function(req, res) {
    User.listar()
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(500).jsonp({error: e}))
});

router.get('/:id', function(req, res) {
  User.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});

router.get('/imagem/:id', function(req, res) {
  User.consultarImagem(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})


router.put("/imagem/:id", function(req,res) {
  User.alterar({foto: req.body.foto, _id: req.params.id})
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Alterar um utilizador
router.put("/:id", function(req,res) {
  User.alterar(req.body)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.delete("/:id", function(req,res){
  User.alterar({_id: req.params.id, bloqueado: true})
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

module.exports = router;
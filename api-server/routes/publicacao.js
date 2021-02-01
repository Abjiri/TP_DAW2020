var express = require('express');
var router = express.Router();

const Publicacao = require('../controllers/publicacao');


router.get('/', function(req, res) {
  Publicacao.listar()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.get('/:id', function(req, res) {
  Publicacao.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.post('/', function(req,res){
  Publicacao.inserir(req.body)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.post('/comentar/:id', function(req,res){
  console.log(req.params.id)
  console.log(req.body)
  Publicacao.adicionarComentario(req.params.id, req.body)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

module.exports = router;

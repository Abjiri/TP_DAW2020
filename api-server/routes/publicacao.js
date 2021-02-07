var express = require('express');
var router = express.Router();

const Publicacao = require('../controllers/publicacao');

router.get('/', function(req, res) {
  Publicacao.listar()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.get('/autor/:id', function(req,res){
  Publicacao.pubsUtilizador(req.params.id)
    .then(dados=>res.status(200).jsonp(dados))
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

router.post('/atualizarFoto/:id', function(req, res){
  Publicacao.atualizarFoto(req.params.id, req.body.foto)
    .then(dados => {
      Publicacao.atualizarFotoComments(req.params.id, req.body.foto)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: e}))
    })
    .catch(e => res.status(500).jsonp({error: e}))
})

// Atualizar estado para indisponível
router.post('/atualizarEstado/:id', function(req, res){
  Publicacao.atualizarEstado(req.params.id, req.body.disp)
    .then(dados => res.status(201).jsonp({dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.post('/comentar/:id', function(req,res){
  Publicacao.adicionarComentario(req.params.id, req.body)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

module.exports = router;

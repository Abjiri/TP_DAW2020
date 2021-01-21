var express = require('express');
var router = express.Router();

const Recurso = require('../controllers/recurso')

// Listar todos os recursos
router.get('/recursos', function(req, res) {
  Recurso.listar()
    .then(dados => res.status(200).jsonp(dados) )
    .catch(e => res.status(500).jsonp({error: e}))
});

router.get('/recursos/numero', function(req, res) {
  Recurso.contar()
    .then(dados => res.status(200).jsonp({numero: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Consultar um recurso
router.get('/recursos/:id', function(req, res) {
  Recurso.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});

// Inserir um recurso
router.post('/recursos', function(req, res){
  Recurso.inserir(req.body)
    .then(dados => res.status(201).jsonp({dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Alterar um recurso
router.put('/recursos', function(req, res){
  Recurso.alterar(req.body)
    .then(dados => res.status(201).jsonp({dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Remover um recurso
router.delete('/recursos/:id', function(req, res) {
  Recurso.remover(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});

module.exports = router;

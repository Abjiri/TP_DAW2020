var express = require('express');
var router = express.Router();

const Recurso = require('../controllers/recurso');
const RecursoTipo = require('../controllers/tipo_recurso')

// Listar todos os recursos
router.get('/', function(req, res) {
  Recurso.listar()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});

// Listar tipos de recursos
router.get('/tipos', function(req, res){
  RecursoTipo.listar()
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Consultar um recurso
router.get('/:id', function(req, res) {
  Recurso.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});

// Inserir recursos
router.post('/', function(req, res){
  Recurso.inserir(req.body.ficheiros)
    .then(dados => {
      RecursoTipo.inserir(req.body.tiposNovos)
        .then(dados2 => res.status(201).jsonp({dados}))
        .catch(e => res.status(500).jsonp({error: e}))
    })
    .catch(e => res.status(500).jsonp({error: e}))
})

// Inserir recursos
router.post('/:id/download', function(req, res){
  Recurso.incrementarDownloads(req.params.id)
    .then(dados => res.status(201).jsonp({dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Alterar um recurso
router.put('/', function(req, res){
  Recurso.alterar(req.body)
    .then(dados => res.status(201).jsonp({dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Classificar um recurso
router.put('/:id/classificar/', function(req, res) {
  Recurso.atualizarClassificacao(req.params.id, req.body)
    .then(dados => {
      if (!dados) {
        Recurso.classificar(req.params.id, req.body)
          .then(dados => res.status(201).jsonp({dados}))
          .catch(e => res.status(500).jsonp({error: e}))
      }
      else res.status(201).jsonp({dados})
    })
    .catch(e => res.status(500).jsonp({error: e}))
});

// Remover um recurso
router.delete('/:id', function(req, res) {
  Recurso.remover(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});

module.exports = router;

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

// Listar recursos ordenados por critério
router.get('/ordenar/:criterio/:sentido', function(req, res){
  Recurso.ordenarPor(req.params)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Pesquisar certo tipo de recursos
router.post('/pesquisar', function(req, res) {
  switch (req.body.filtro) {
    case 'titulo': 
      Recurso.pesquisarPorTitulo(req.body.titulo, req.body.meus_recursos)
        .then(dados => res.status(201).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: e}))
      break;
    case 'tipo': 
      Recurso.pesquisarPorTipo(req.body.tipo, req.body.meus_recursos)
        .then(dados => res.status(201).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: e}))
      break;
    case 'autor':
      Recurso.pesquisarPorAutor(req.body.autor, req.body.meus_recursos)
        .then(dados => res.status(201).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: e}))
      break;
    case 'ano': 
      Recurso.pesquisarPorAno(req.body.ano, req.body.meus_recursos)
        .then(dados => res.status(201).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: e}))
      break;
    default:
      Recurso.pesquisarMeusRecursos(req.body.meus_recursos)
        .then(dados => res.status(201).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: e}))
      break;
  }
})

// Consultar um recurso
router.get('/:id', function(req, res) {
  Recurso.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});

// Inserir recursos
router.post('/', function(req, res){
  Recurso.inserir(req.body.recurso)
    .then(dados => {
      console.log("correu bem ate aqui")
      RecursoTipo.inserir(req.body.tiposNovos)
        .then(dados2 => res.status(201).jsonp({dados}))
        .catch(e => res.status(500).jsonp({error: e}))
    })
    .catch(e => res.status(500).jsonp({error: e}))
})

// Atualizar recurso
router.post('/editar/:id', function(req, res) {
  Recurso.editarRecurso(req.params.id, req.body)
    .then(dados => {console.log(dados);
      if (req.body.tipoNovo) {
        RecursoTipo.inserir([{tipo: req.body.tipo}])
          .then(dados2 => res.status(201).jsonp({dados}))
          .catch(e => res.status(500).jsonp({error: e}))
      }
      else res.status(201).jsonp({dados})
    })
    .catch(e => res.status(500).jsonp({error: e}))
})

// Inserir recursos
router.post('/download', function(req, res){
  var erros = []

  req.body.forEach(dir => {
    Recurso.incrementarDownloads(dir)
      .then(d => {})
      .catch(e => erros.push(e))
  })

  if (!erros.length) res.status(201).jsonp({})
  else res.status(500).jsonp({erros})
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

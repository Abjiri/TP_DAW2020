var express = require('express');
var router = express.Router();

const Noticia = require('../controllers/noticia');


router.get('/', function(req, res) {
  Noticia.listar()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.get('/autor/:id',function(req,res){
  Noticia.noticiasUtilizador(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Inserir noticia
router.post('/', function(req, res){
  Noticia.inserir(req.body)
    .then(dados => res.status(201).jsonp({dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Atualizar estado para indisponível
router.post('/atualizarEstado/:id', function(req, res){
  Noticia.atualizarEstado(req.params.id)
    .then(dados => res.status(201).jsonp({dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Atualizar foto dos utilizadores nas noticias
router.post('/atualizarFoto/:id', function(req, res){
  Noticia.atualizarFoto(req.params.id, req.body.foto)
    .then(dados => res.status(201).jsonp({dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

module.exports = router;

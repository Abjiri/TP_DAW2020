var express = require('express');
var router = express.Router();

const Publicacao = require('../controllers/publicacao');


router.get('/', function(req, res) {
  Publicacao.listar()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

module.exports = router;

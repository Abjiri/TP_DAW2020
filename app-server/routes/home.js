var express = require('express');
var router = express.Router();

var axios = require('axios');

var aux = require('./functions')

router.get('/', function(req, res) {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    axios.get('http://localhost:8001/publicacoes?token=' + req.cookies.token)
      .then(pubs => {
        var publicacoes = {}
        var colunas = 4
        var linhas = Math.ceil(pubs.data.length/colunas)

        for (var i = 0; i < linhas; i++) publicacoes['linha'+i] = []
        for (var i = 0; i < pubs.data.length; i++) {
          publicacoes['linha'+(Math.floor(i/colunas))].push(pubs.data[i])
        }


        /* for (var i = 0; i < colunas; i++) publicacoes['coluna'+i] = []
        for (var i = 0; i < pubs.data.length; i++)
          publicacoes['coluna'+(i%colunas)].push(pubs.data[i]) */

        axios.get('http://localhost:8001/noticias?token=' + req.cookies.token)
          .then(noticias => {
            var token = aux.unveilToken(req.cookies.token)
            console.log(linhas)
            console.log(colunas)
            console.log(publicacoes)
            res.render('home', {nivel: token.nivel, pubs: publicacoes, linhas, colunas, noticias: noticias.data})
          })
          .catch(error => res.render('error', {error}))
      })
      .catch(error => res.render('error', {error}))
  }
});

module.exports = router;

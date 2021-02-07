var express = require('express');
var router = express.Router();

var axios = require('axios');
var aux = require('./functions')


router.get('/:id', function(req,res) {
    if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
    else {
        var token = aux.unveilToken(req.cookies.token)

        axios.get('http://localhost:8001/publicacoes/' + req.params.id + '?token=' + req.cookies.token)
            .then(dados => {
                let visitante
                aux.sortComments(dados.data)
                axios.get('http://localhost:8001/users/' + token._id + '?token=' + req.cookies.token)
                    .then(visitanteData => {
                        visitante = visitanteData.data
                        res.render('publicacao', {publicacao: dados.data, nivel: token.nivel, visitante})
                    })  
                    .catch(error => res.render('error', {error}))
            })
            .catch(error => res.render('error', {error}))
    }
})

router.post('/', function(req, res) {
    if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
    else {
        var token = aux.unveilToken(req.cookies.token)

        if (token.nivel == 'produtor' || token.nivel == 'admin') {
            req.body["id_autor"] = token._id
            req.body["dataCriacao"] = new Date().toISOString().substr(0,19)
            axios.get('http://localhost:8001/users/imagem/' + token._id + '?token=' + req.cookies.token)
                .then(fotoData => {
                    req.body["nome_autor"] = token.nome
                    req.body["foto"] = fotoData.data.foto

                    axios.get('http://localhost:8001/recursos/titulo/' + req.body.id_recurso + '?token=' + req.cookies.token)
                    .then(tituloData => {
                        req.body["titulo_recurso"] = tituloData.data.titulo

                        axios.post('http://localhost:8001/publicacoes?token=' + req.cookies.token, req.body)
                            .then(dados => {
                                axios.post('http://localhost:8001/recursos/publicacao/' + req.body.id_recurso + '?token=' + req.cookies.token)
                                    .then(d => res.redirect("/publicacoes/" + dados.data._id))
                                    .catch(error => res.render('error', {error}))
                            })
                            .catch(error => res.render('error', {error}))
                    })
                    .catch(error => res.render('error', {error}))
                })
                .catch(error => res.render('error', {error})) 
        }
    }
})

router.post('/comentar/:id', function(req, res) {
    if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
    else {
        var token = aux.unveilToken(req.cookies.token)

        if (token.nivel == 'produtor' || token.nivel == 'admin') {
            req.body["id_autor"] = token._id
            req.body["dataCriacao"] = new Date().toISOString().substr(0,19)
            axios.get('http://localhost:8001/users/imagem/' + token._id + '?token=' + req.cookies.token)
                .then(fotoData => {
                    req.body["nome_autor"] = token.nome
                    req.body["foto"] = fotoData.data.foto
                    axios.post('http://localhost:8001/publicacoes/comentar/' + req.params.id + '?token=' + req.cookies.token, req.body)
                        .then(dados => res.redirect("/publicacoes/"+dados.data._id))
                        .catch(error => res.render('error', {error}))
                })
                .catch(error => res.render('error', {error})) 
        }
    }
})

module.exports = router;

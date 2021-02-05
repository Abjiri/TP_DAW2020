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
                aux.sortComments(dados.data)

                let users = {}
                let promises = []
                let visitante, autor

                dados.data.comments.forEach(c => {
                    promises.push(
                        axios.get('http://localhost:8001/users/' + c.id_autor + '?token=' + req.cookies.token)
                            .then(userData => {
                                let user = userData.data
                                if (!(user._id in users)) users[user._id] = user
                            })  
                            .catch(error => res.render('error', {error}))
                    )
                })
                
                promises.push(
                    axios.get('http://localhost:8001/users/' + token._id + '?token=' + req.cookies.token)
                    .then(visitanteData => visitante = visitanteData.data)  
                    .catch(error => res.render('error', {error}))
                )

                promises.push(
                    axios.get('http://localhost:8001/users/' + dados.data.id_autor + '?token=' + req.cookies.token)
                    .then(autorData => autor = autorData.data)  
                    .catch(error => res.render('error', {error}))
                )
                Promise.all(promises).then(() => res.render('publicacao', {publicacao: dados.data, nivel: token.nivel, users, visitante, autor}));
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

            axios.post('http://localhost:8001/publicacoes?token=' + req.cookies.token, req.body)
                .then(dados => res.redirect("/publicacoes/" + dados.data._id))
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
            
            axios.post('http://localhost:8001/publicacoes/comentar/' + req.params.id + '?token=' + req.cookies.token, req.body)
                .then(dados => res.redirect("/publicacoes/"+dados.data._id))
                .catch(error => res.render('error', {error}))
        }
    }
})

module.exports = router;

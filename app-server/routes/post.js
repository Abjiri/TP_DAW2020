var express = require('express');
var router = express.Router();

var axios = require('axios');
var func = require('./functions')


router.get('/:id', function(req,res,next){
    if (!req.cookies.token) res.redirect('/')
    else {
        axios.get('http://localhost:8001/publicacoes/' + req.params.id + '?token=' + req.cookies.token)
            .then(dados => res.render('publicacao', {publicacao: dados.data, auth: true}))
            .catch(error => res.render('error', {error}))
    }
})

router.post('/', function(req, res, next){
    if (!req.cookies.token) res.redirect('/')
    else {
        var token = func.unveilToken(req.cookies.token)
        req.body["id_autor"] = token._id
        req.body["dataCriacao"] = new Date().toISOString().substr(0,16)
        console.log(req.body)
        axios.post('http://localhost:8001/publicacoes?token=' + req.cookies.token, req.body)
            .then(dados => res.redirect("/publicacoes/"+dados.data._id))
            .catch(error => res.render('error', {error}))
    }
})

router.post('/comentar/:id', function(req, res, next){
    if (!req.cookies.token) res.redirect('/')
    else {
        var token = func.unveilToken(req.cookies.token)
        req.body["id_autor"] = token._id
        req.body["dataCriacao"] = new Date().toISOString().substr(0,16)
        axios.post('http://localhost:8001/publicacoes/comentar/' + req.params.id + '?token=' + req.cookies.token, req.body)
            .then(dados => res.redirect("/publicacoes/"+dados.data._id))
            .catch(error => res.render('error', {error}))
    }
})

module.exports = router;

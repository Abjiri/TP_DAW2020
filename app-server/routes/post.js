var express = require('express');
var router = express.Router();

var axios = require('axios');
var func = require('./functions')

router.post('/', function(req, res, next){
    if (!req.cookies.token) res.redirect('/')
    else {
        var token = func.unveilToken(req.cookies.token)
        var dados = req.body
        console.log(dados)
        /*axios.post('http://localhost:8001/posts/' + req.params.id +'?token=' + req.cookies.token, fixed)
            .then(dados => res.redirect("/perfil"))
            .catch(error => res.render('error', {error}))
            */
    }
})

module.exports = router;

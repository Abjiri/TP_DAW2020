var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: './uploads'});

var axios = require('axios');
var fs = require('fs');

var aux = require('./functions')

router.get('/', function(req, res) {
  if (req.cookies.token) {
    axios.get('http://localhost:8001/publicacoes?token=' + req.cookies.token)
      .then(dados => res.render('home', {auth: true, publicacoes: dados.data}))
      .catch(error => res.render('error', {error}))
  }
  else res.render('home', {auth: req.cookies.token ? true : false});
});

router.get('/recursos', function(req, res) {
  if (!req.cookies.token) res.redirect('/users/login')
  else {
    axios.get('http://localhost:8001/recursos?token=' + req.cookies.token)
      .then(dados => res.render('recursos', {lista: dados.data, auth: true}))
      .catch(error => res.render('error', {error}))
  }
})

router.post('/recursos/upload', upload.array('recurso'), function(req, res) {
  var token = aux.unveilToken(req.cookies.token);
  var files = [];

  for (var i = 0; i < req.files.length; i++) {
    try {
      let oldPath = __dirname.split('/routes')[0] + '/' + req.files[i].path;
      let newPath = __dirname.split('/routes')[0] + '/public/fileStore/' + req.files[i].originalname;

      fs.rename(oldPath, newPath, (err) => {
        if (err) throw err;
      });

      files.push({
        tipo: req.files.length == 1 ? req.body.tipo : req.body.tipo[i],
        titulo: req.files.length == 1 ? req.body.titulo : req.body.titulo[i],
        descricao: req.files.length == 1 ? req.body.descricao : req.body.descricao[i],
        dataCriacao: req.files.length == 1 ? req.body.dataCriacao : req.body.dataCriacao[i],
        visibilidade: req.body[`visibilidade${req.body.nr_visibilidade[i]}`],
        autor: token._id,
        nome_ficheiro: req.files[i].originalname,
        tamanho: req.files[i].size,
        tipo_mime: req.files[i].mimetype
      });
    } catch (err) {
      console.log("Erro ao renomear um dos ficheiros: " + err);
    }
  }

  axios.post('http://localhost:8001/recursos?token=' + req.cookies.token, files)
    .then(dados => res.redirect('/recursos'))
    .catch(error => res.render('error', {error}))
})

module.exports = router;

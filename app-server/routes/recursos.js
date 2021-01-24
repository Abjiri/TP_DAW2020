var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: './uploads'});

var fs = require('fs');
var axios = require('axios')

var aux = require('./functions')


router.get('/', function(req, res) {
    if (!req.cookies.token) res.redirect('/')
    else {
      axios.get('http://localhost:8001/recursos?token=' + req.cookies.token)
        .then(dados => {
          var token = aux.unveilToken(req.cookies.token)

          dados.data.forEach(r => {
            r.tamanho = aux.calculateSize(r.tamanho)
            r.dono = token._id == r.idAutor
          })
          res.render('recursos', {lista: dados.data, auth: true})
        })
        .catch(error => res.render('error', {error}))
    }
})

router.get('/:id', function(req, res) {
    if (!req.cookies.token) res.redirect('/')
    else {
        axios.get('http://localhost:8001/recursos/' + req.params.id + '?token=' + req.cookies.token)
            .then(dados => {console.log(dados.data); res.render('recurso', {r: dados.data, auth: true})})
            .catch(error => res.render('error', {error}))
    }
})

router.get('/:id/:fname/download', (req,res) => {
  axios.post('http://localhost:8001/recursos/' + req.params.id + '/download?token=' + req.cookies.token)
    .then(dados => {
      res.download(__dirname.split('/routes')[0] + '/public/fileStore/' + req.params.fname)
    })
    .catch(error => res.render('error', {error}))
})

router.get('/:id/classificar/:pont', (req,res) => {
  var token = aux.unveilToken(req.cookies.token);

  axios.put(`http://localhost:8001/recursos/${req.params.id}/classificar/?token=${req.cookies.token}`,
    {user: token._id, pontuacao: Number.parseInt(req.params.pont)})
      .then(dados => res.redirect('/recursos'))
      .catch(error => res.render('error', {error}))
})

router.get('/:id/remover', (req,res) => {
  axios.delete('http://localhost:8001/recursos/' + req.params.id + '?token=' + req.cookies.token)
      .then(dados => res.redirect('/recursos'))
      .catch(error => res.render('error', {error}))
})
  
router.post('/upload', upload.array('recurso'), function(req, res) {
    var token = aux.unveilToken(req.cookies.token);
    var files = [];
  
    for (var i = 0; i < req.files.length; i++) {
      try {
        let oldPath = `${__dirname.split('/routes')[0]}/${req.files[i].path}`;
        let newPath = `${__dirname.split('/routes')[0]}/public/fileStore/${token._id}-${req.files[i].originalname}`;
  
        fs.rename(oldPath, newPath, (err) => {
          if (err) throw err;
        });
  
        files.push({
          tipo: req.files.length == 1 ? req.body.tipo : req.body.tipo[i],
          titulo: req.files.length == 1 ? req.body.titulo : req.body.titulo[i],
          descricao: req.files.length == 1 ? req.body.descricao : req.body.descricao[i],
          dataCriacao: req.files.length == 1 ? req.body.dataCriacao : req.body.dataCriacao[i],
          visibilidade: req.body[`visibilidade${req.body.nr_visibilidade[i]}`],
          idAutor: token._id,
          nomeAutor: token.nome,
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
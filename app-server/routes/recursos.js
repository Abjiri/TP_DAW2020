var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: './uploads'});
//var JSZip = require('jszip')
var AdmZip  = require('adm-zip')

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
      var dir = __dirname.split('/routes')[0] + '/public/fileStore/' + req.params.fname
      var filename = req.params.fname.split('-')[1]

      res.download(dir,filename)
    })
    .catch(error => res.render('error', {error}))
})

router.get('/:id/classificar/:pont', (req,res) => {
  var token = aux.unveilToken(req.cookies.token);
  console.log("boas")

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
  
router.post('/upload', upload.single('zip'), function(req, res) {
    console.log(JSON.stringify(req.file))
    console.log(JSON.stringify(req.body))
    //var hashs = {}
    var zippath = (__dirname + req.file.path).replace("routes","").replace(/\\/g, "\\\\")
    var extractpath = (__dirname + "uploads" ).replace("routes","").replace(/\\/g, "\\\\")
    //var path2 = (__dirname + "uploads\\login.zip").replace("routes","").replace(/\\/g, "\\\\")
    var zip = new AdmZip(zippath)
    zip.extractAllTo(extractpath)
    zip.getEntries().forEach(entry => {
      if(entry.entryName.match(/data\/.+/)){
        console.log(entry.toString())
      }
      else if (entry.entryName == "manifest-md5.txt") {
        let entries = entry.getData().toString().split("\n")
        entries.pop()
        entries.forEach(a=>{
          let separated = a.split(" ")
          let hash = separated[0]
          //let filename = separated[1].split("data/")[1]
          //hashs[filename] = hash 
          var newhash = aux.calculateMd5(extractpath + ("\\" + separated[1]).replace(/\\/g,"\\\\").replace(/\//g,"\\\\"))
          // aqui dao bem... meter um if talvez mais tarde
        })
      }
    })
    var token = aux.unveilToken(req.cookies.token);
    var ficheiros = [];
    var tiposNovos = [];
  
    for (var i = 0; i < req.files.length; i++) {
      try {
        let oldPath = `${__dirname.split('/routes')[0]}/${req.files[i].path}`;
        let newPath = `${__dirname.split('/routes')[0]}/public/fileStore/${token._id}-${req.files[i].originalname}`;
  
        fs.rename(oldPath, newPath, (err) => {
          if (err) throw err;
        });

        var tipo = req.files.length == 1 ? req.body.tipo : req.body.tipo[i]
        if (tipo == "Outro") {
          tipo = req.files.length == 1 ? req.body.outro_tipo : req.body.outro_tipo[i]
          tipo = tipo.charAt(0).toUpperCase() + tipo.slice(1)

          tiposNovos.push({tipo})
        }
  
        ficheiros.push({
          tipo,
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
  
    axios.post('http://localhost:8001/recursos?token=' + req.cookies.token, {ficheiros, tiposNovos})
      .then(dados => {
        console.log(dados.data)
        var docs = dados.data.dados;
        var recursos = [];
        
        for (var i = 0; i < docs.length; i++) {
          if (docs[i].visibilidade == 'publico') {
            recursos.push({
              id: docs[i]._id,
              titulo: docs[i].titulo,
              tipo: docs[i].tipo.toLowerCase()
            })
          }
        }

        var noticia = {
            idAutor: token._id,
            nomeAutor: token.nome,
            recursos
          }

        axios.post('http://localhost:8001/noticias?token=' + req.cookies.token, noticia)
          .then(dados => res.redirect('/recursos'))
          .catch(error => res.render('error', {error}))
      })
      .catch(error => res.render('error', {error}))
})
  
module.exports = router;
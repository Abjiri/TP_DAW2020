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
    var token = aux.unveilToken(req.cookies.token);
    var ficheiros = [];
    var tiposNovos = [];

    var total = 0
    var recursos = []
    var recursosInfo = []
    var valido = true
    var zippath = (__dirname + req.file.path).replace("routes","").replace(/\\/g, "\\\\")
    var extractpath = (__dirname + "uploads" ).replace("routes","").replace(/\\/g, "\\\\")
    var zip = new AdmZip(zippath)
    zip.extractAllTo(extractpath)
    zip.getEntries().forEach(entry => {
      if(entry.entryName.match(/data\/.+/)){
        recursos[total++] = entry.name
      }
      else if (entry.entryName == "manifest-md5.txt") {
        let entries = entry.getData().toString().split("\n")
        entries.pop()
        entries.forEach(a=>{
          let separated = a.split(" ")
          let hash = separated[0]
          let nome_ficheiro = separated[1].split("data/")[1]
          let diretoria = extractpath + ("\\" + separated[1]).replace(/\\/g,"\\\\").replace(/\//g,"\\\\")
          let nova_diretoria = extractpath.replace("uploads","public\\\\fileStore\\\\") + Date.now() + "-" + nome_ficheiro
          let newhash = aux.calculateMd5(diretoria)
          recursosInfo.push({nome: nome_ficheiro, mime: aux.getMimeType(diretoria), tamanho: aux.getSize(diretoria), path: nova_diretoria.split("app-server\\\\")[1].replace(/\\\\/g,"\\")})
          fs.rename(diretoria, nova_diretoria, err => {
            if (err) throw err
          })
          let pertence = false
          recursos.forEach(r=>{
            if(r==nome_ficheiro) pertence = true
          })
          if(newhash != hash || !pertence) valido = false
        })
      }
    })
    
    if(valido) {
      axios.get('http://localhost:8001/recursos/tipos?token=' + req.cookies.token)
        .then(tipos_bd => {

          for (var i = 0; i < total; i++) {
            var tipo = req.body.tipo[i]

            if (tipo == "Outro") {
              tipo = req.body.outro_tipo[i]
              var novo = true

              for (var j = 0; j < tipos_bd.data.length; i++) {
                if (tipo.localeCompare(tipos_bd.data[i].tipo, 'pt', { sensitivity: 'base' }) == 0) {
                  tipo = tipos_bd.data[i].tipo
                  novo = false
                  break
                }
              }
              
              if (novo) {
                tipo = tipo.charAt(0).toUpperCase() + tipo.slice(1)
                tiposNovos.push({tipo})
              }
            }
        
            ficheiros.push({
              tipo,
              titulo: req.body.titulo[i],
              descricao: req.body.descricao[i],
              dataCriacao: req.body.dataCriacao[i],
              visibilidade: req.body[`visibilidade${i}`],
              idAutor: token._id,
              nomeAutor: token.nome,
              nome_ficheiro: recursosInfo[i].nome,
              tamanho: recursosInfo[i].tamanho,
              tipo_mime: recursosInfo[i].mime,
              diretoria: recursosInfo[i].path
            });
          }
          aux.clearZipFolder(extractpath,zippath)
          axios.post('http://localhost:8001/recursos?token=' + req.cookies.token, {ficheiros, tiposNovos})
          .then(dados => {
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
              .then(dados => {
                console.log("ESTO AQUI ")
                res.redirect('/recursos')
              })
              .catch(error => res.render('error', {error}))
          })
          .catch(error => res.render('error', {error}))
        })
        .catch(error => res.render('error', {error}))
    }
    else res.render('error', {error})
})
  
module.exports = router;
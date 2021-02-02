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
          var vars = aux.variaveisRecursos(dados.data, req.cookies.token)
          res.render('recursos', vars)
        })
        .catch(error => res.render('error', {error}))
    }
})

router.post('/ordenar/:criterio/:sentido', function(req, res) {
  if (!req.cookies.token) res.redirect('/')
  else {
    axios.get(`http://localhost:8001/recursos/ordenar/${req.params.criterio}/${req.params.sentido}?token=` + req.cookies.token)
      .then(dados => {
        var vars = aux.variaveisRecursos(dados.data, req.cookies.token)
        vars.ordemAtual = req.params.criterio + '/' + req.params.sentido

        res.render('recursos', vars)
      })
      .catch(error => res.render('error', {error}))
  }
})

router.post('/ordenarFiltragem/:criterio/:sentido', function(req, res) {
  if (!req.cookies.token) res.redirect('/')
  else {
    var recursos = JSON.parse(req.body.recursos)
    var autores = JSON.parse(req.body.autores)
    var tipos = JSON.parse(req.body.tipos)
    var filtroAtual = JSON.parse(req.body.filtroAtual)
    var crit = req.params.criterio
    var sentido = req.params.sentido

    if (sentido == '0') {
      recursos.sort((a, b) => (a[crit] > b[crit]) ? -1 : 1)
    }
    else {
      recursos.sort((a, b) => (a[crit] > b[crit]) ? sentido : 
                    (a[crit] == b[crit]) ? ((a.dataUltimaMod > b.dataUltimaMod) ? -1 : 1) : -sentido)
    }

    var vars = {auth: true, recursos, tipos, autores, filtroAtual}
    if (sentido != '0') vars.ordemAtual = crit + '/' + sentido

    res.render('recursos', vars)
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

router.post('/download', (req,res) => {
  var diretorias = JSON.parse(req.body.selecionados)
  
  axios.post('http://localhost:8001/recursos/download?token=' + req.cookies.token, diretorias)
    .then(() => {
      /* download zip do DIP */
      res.redirect('/recursos')
    })
    .catch(errors => res.render('error', {error: errors[0]}))
})

router.post('/pesquisar', (req, res) => {
  axios.post(`http://localhost:8001/recursos/pesquisar?token=${req.cookies.token}`, req.body)
    .then(dados => {
      var novoFiltro;

      switch (req.body.filtro) {
        case 'titulo': novoFiltro = {"tipo": "Título", "valor": req.body.titulo}; break;
        case 'tipo': novoFiltro = {"tipo": "Tipo", "valor": req.body.tipo}; break;
        case 'autor': novoFiltro = {"tipo": "Autor", "valor": req.body.autor}; break;
        case 'ano': novoFiltro = {"tipo": "Ano", "valor": req.body.ano}; break;
      }

      var vars = aux.variaveisRecursos(dados.data, req.cookies.token)
      vars.filtroAtual = novoFiltro
      
      res.render('recursos', vars)
    })
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
            var tipo = total==1 ? req.body.tipo : req.body.tipo[i]
            
            if (tipo == "Outro") {
              tipo = total==1 ? req.body.outro_tipo : req.body.outro_tipo[i]
              var novo = true
              for (var j = 0; j < tipos_bd.data.length; j++) {
                if (tipo.localeCompare(tipos_bd.data[j].tipo, 'pt', { sensitivity: 'base' }) == 0) {
                  tipo = tipos_bd.data[j].tipo
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
              titulo: total==1 ? req.body.titulo : req.body.titulo[i],
              descricao: total==1 ? req.body.descricao : req.body.descricao[i],
              dataCriacao: total==1 ? req.body.dataCriacao : req.body.dataCriacao[i],
              visibilidade: req.body[`visibilidade${i}`],
              idAutor: token._id,
              nomeAutor: token.nome,
              nome_ficheiro: recursosInfo[i].nome,
              tamanho: recursosInfo[i].tamanho,
              tipo_mime: recursosInfo[i].mime,
              diretoria: recursosInfo[i].path.replace(/^public/, "")
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
              .then(dados => res.redirect('/recursos'))
              .catch(error => res.render('error', {error}))
          })
          .catch(error => res.render('error', {error}))
        })
        .catch(error => res.render('error', {error}))
    }
    else res.render('error', {error})
})
  
module.exports = router;
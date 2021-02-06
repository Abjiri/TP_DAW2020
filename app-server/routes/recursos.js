var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: './uploads'});
//var JSZip = require('jszip')
var AdmZip  = require('adm-zip')
var bagit = require('./bagit')

var fs = require('fs');
var axios = require('axios')

var aux = require('./functions')

router.get('/', function(req, res) {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    axios.get('http://localhost:8001/recursos?token=' + req.cookies.token)
      .then(dados => {
        axios.get('http://localhost:8001/recursos/tipos?token=' + req.cookies.token)
          .then(tipos_bd => {
            var varsPug = aux.variaveisRecursos(dados.data, tipos_bd, req.cookies.token, false)
            res.render('recursos', varsPug)
          })
          .catch(error => res.render('error', {error}))
      })
      .catch(error => res.render('error', {error}))
  }
})

router.post('/ordenar/:criterio/:sentido', function(req, res) {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    axios.get(`http://localhost:8001/recursos/ordenar/${req.params.criterio}/${req.params.sentido}?token=` + req.cookies.token)
      .then(dados => {
        axios.get('http://localhost:8001/recursos/tipos?token=' + req.cookies.token)
          .then(tipos_bd => {
            var varsPug = aux.variaveisRecursos(dados.data, tipos_bd, req.cookies.token, false)
            varsPug.ordemAtual = req.params.criterio + '/' + req.params.sentido
    
            res.render('recursos', varsPug)
          })
          .catch(error => res.render('error', {error}))
      })
      .catch(error => res.render('error', {error}))
  }
})

router.post('/ordenarFiltragem/:criterio/:sentido', function(req, res) {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    var token = aux.unveilToken(req.cookies.token)

    var meus_recursos = req.body.meus_recursos_ordenacao ? true : false
    var recursos = JSON.parse(req.body.recursos)
    var autores = JSON.parse(req.body.autores)
    var tipos = JSON.parse(req.body.tipos)
    
    var crit = req.params.criterio
    var sentido = req.params.sentido

    if (sentido == '0') recursos.sort((a, b) => (a[crit] > b[crit]) ? -1 : 1)
    else recursos.sort((a, b) => (a[crit] > b[crit]) ? sentido : 
                      (a[crit] == b[crit]) ? ((a.dataUltimaMod > b.dataUltimaMod) ? -1 : 1) : -sentido)

    var varsPug

    if (req.body.filtroAtual) {
      var filtroAtual = JSON.parse(req.body.filtroAtual)
      varsPug = {nivel: token.nivel, recursos, tipos, autores, filtroAtual, meus_recursos}
    }
    else varsPug = {nivel: token.nivel, recursos, tipos, autores, meus_recursos}

    if (sentido != '0') varsPug.ordemAtual = crit + '/' + sentido
    res.render('recursos', varsPug)
  }
})

router.get('/limpar-filtro/:meus_recursos?', (req, res) => {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {    
    if (req.params.meus_recursos) {
      var token = aux.unveilToken(req.cookies.token)

      axios.post(`http://localhost:8001/recursos/pesquisar?token=${req.cookies.token}`, {meus_recursos: token._id})
        .then(dados => {
          axios.get('http://localhost:8001/recursos/tipos?token=' + req.cookies.token)
            .then(tipos_bd => {
              var varsPug = aux.variaveisRecursos(dados.data, tipos_bd, req.cookies.token, true)
              res.render('recursos', varsPug)
            })
            .catch(error => res.render('error', {error}))
        })
        .catch(error => res.render('error', {error}))
    }
    else res.redirect('/recursos')
  }
})

router.get('/:id', function(req, res) {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    axios.get('http://localhost:8001/recursos/' + req.params.id + '?token=' + req.cookies.token)
      .then(dados => {
        axios.get('http://localhost:8001/recursos/tipos?token=' + req.cookies.token)
          .then(tipos_bd => {
            var recurso = aux.prepararRecurso(dados.data, tipos_bd, req.cookies.token)
            res.render('recurso', recurso)
          })
          .catch(error => res.render('error', {error}))
      })
      .catch(error => res.render('error', {error}))
  }
})

router.get('/:id/classificar/:pont', (req,res) => {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    var token = aux.unveilToken(req.cookies.token);

    if (token.nivel == 'produtor' || token.nivel == 'admin') {
      axios.put(`http://localhost:8001/recursos/${req.params.id}/classificar/?token=${req.cookies.token}`,
        {user: token._id, pontuacao: Number.parseInt(req.params.pont)})
          .then(dados => res.redirect(req.headers.referer))
          .catch(error => res.render('error', {error}))
    }
    else res.redirect(req.headers.referer)
  }
})

router.get('/:id/remover', (req,res) => {
  axios.delete('http://localhost:8001/recursos/' + req.params.id + '?token=' + req.cookies.token)
    .then(dados => {
      axios.post('http://localhost:8001/noticias/atualizarEstado/' + req.params.id + '?token=' + req.cookies.token)
        .then(d => res.redirect('/recursos'))
        .catch(error => res.render('error', {error}))
    })
    .catch(error => res.render('error', {error}))
})

router.post('/download', (req,res) => {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    var diretorias = JSON.parse(req.body.selecionados)
    
    axios.post('http://localhost:8001/recursos/download?token=' + req.cookies.token, diretorias)
      .then(() => {
        var zip = bagit.zipRecursos(diretorias)
        zip.generateAsync({ type: "base64" }).then((base64) => {
          let zipRet = Buffer.from(base64, "base64");
          res.writeHead(200, {
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename=${Date.now()}.zip`,
          })
          res.end(zipRet)
        })
      })
      .catch(errors => res.render('error', {error: errors[0]}))
  }
})

router.post('/pesquisar', (req, res) => {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    if (!req.body.meus_recursos &&
        !req.body.filtroAtual && 
        (!req.body.filtro || !(req.body.titulo || req.body.tipo || req.body.autor || req.body.ano))) {
      res.redirect('/recursos')
    }
    else {
      var token = aux.unveilToken(req.cookies.token)

      if (req.body.meus_recursos) req.body.meus_recursos = token._id

      if (req.body.filtro && !(req.body.titulo || req.body.tipo || req.body.autor || req.body.ano))
        delete req.body.filtro

      if (req.body.filtroAtual) {
        var filtroAtual = JSON.parse(req.body.filtroAtual)
        req.body.filtro = filtroAtual.tipoOriginal
        
        switch (filtroAtual.tipoOriginal) {
          case 'titulo': req.body.titulo = filtroAtual.valor; break;
          case 'tipo': req.body.tipo = filtroAtual.valor; break;
          case 'autor': req.body.autor = filtroAtual.valor; break;
          case 'ano': req.body.ano = filtroAtual.valor; break;
        }
      }

      axios.post(`http://localhost:8001/recursos/pesquisar?token=${req.cookies.token}`, req.body)
        .then(dados => {
          axios.get('http://localhost:8001/recursos/tipos?token=' + req.cookies.token)
            .then(tipos_bd => {
              var varsPug = aux.variaveisRecursos(dados.data, tipos_bd, req.cookies.token, req.body.meus_recursos ? true : false)

              if (req.body.filtro) {
                var novoFiltro;

                switch (req.body.filtro) {
                  case 'titulo': novoFiltro = {"tipo": "Título", "valor": req.body.titulo}; break;
                  case 'tipo': novoFiltro = {"tipo": "Tipo", "valor": req.body.tipo}; break;
                  case 'autor': novoFiltro = {"tipo": "Autor", "valor": req.body.autor}; break;
                  case 'ano': novoFiltro = {"tipo": "Ano", "valor": req.body.ano}; break;
                }
                novoFiltro.tipoOriginal = req.body.filtro
                varsPug.filtroAtual = novoFiltro
              }
                
              res.render('recursos', varsPug)
            })
            .catch(error => res.render('error', {error}))
        })
        .catch(error => res.render('error', {error}))
    }
  }
})

router.post('/editar/:id', upload.any(), function(req, res) {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    var token = aux.unveilToken(req.cookies.token)

    //verifica que é mesmo o autor antes de avançar com a edição
    if ((token.nivel == 'produtor' || token.nivel == 'admin') && token._id == req.body.idAutor) {
      axios.get('http://localhost:8001/recursos/tipos?token=' + req.cookies.token)
        .then(tipos_bd => {
          //processar o req.body --------------------------------------------------------------
          req.body.removerFicheiros = JSON.parse(req.body.removerFicheiros)
          delete req.body.ficheiros
          req.body.visibilidade = req.body.visibilidade ? false : true
          var tipo = req.body.tipo

          if (tipo == "Outro") {
            tipo = req.body.outro_tipo
            var novo = true

            for (var j = 0; j < tipos_bd.data.length; j++) {
              if (tipo.localeCompare(tipos_bd.data[j].tipo, 'pt', { sensitivity: 'base' }) == 0) {
                tipo = tipos_bd.data[j].tipo
                novo = false
                break
              }
            }

            if (novo) tipo = tipo.charAt(0).toUpperCase() + tipo.slice(1)

            req.body.tipo = tipo
            req.body.tipoNovo = novo
            tipos_bd.data.push({tipo})
          }

          //processar o req.files -------------------------------------------------------------

          req.body.ficheiros = []
          req.files.forEach(f => {
            if (f.fieldname == 'recurso') {
              var data = Date.now()
              f.originalname = f.originalname.replace(/ /g, "_")

              let oldPath = __dirname.split('/routes')[0] + '/' + f.path
              let newPath = __dirname.split('/routes')[0] + '/public/fileStore/' + data + '-' + f.originalname

              fs.renameSync(oldPath, newPath, (err) => {
                  if (err) throw err;
              });

              req.body.ficheiros.push({
                nome_ficheiro: f.originalname,
                tamanho: f.size,
                tipo_mime: f.mimetype,
                diretoria: 'fileStore/' + data + '-' + f.originalname,
                hash: aux.calculateMd5(newPath)
              })
            }
          })

          axios.post(`http://localhost:8001/recursos/editar/${req.params.id}?token=${req.cookies.token}`, req.body)
            .then(d => {
              if (req.body.visibilidade) {
                var token = aux.unveilToken(req.cookies.token)

                axios.get('http://localhost:8001/users/imagem/' + token._id + '?token=' + req.cookies.token)
                  .then(foto => {
                    var noticia = {
                      autor: {
                        id: token._id,
                        nome: token.nome,
                        foto: foto.data.foto
                      },
                      recurso: {
                        id: req.params.id,
                        titulo: req.body.titulo,
                        tipo: req.body.tipo,
                        estado: 'Atualizado'
                      },
                      data: new Date().toISOString().substr(0,19)
                    }
    
                    axios.post('http://localhost:8001/noticias?token=' + req.cookies.token, noticia)
                      .then(d => {
                        axios.get('http://localhost:8001/recursos/' + req.params.id + '?token=' + req.cookies.token)
                          .then(dados => {
                            var recurso = aux.prepararRecurso(dados.data, tipos_bd, req.cookies.token)
                            res.render('recurso', recurso)
                          })
                          .catch(error => res.render('error', {error}))
                      })
                      .catch(error => res.render('error', {error}))
                  })
                  .catch(error => res.render('error', {error}))
              }
              else {
                axios.post('http://localhost:8001/noticias/atualizarEstado/' + req.params.id + '?token=' + req.cookies.token)
                .then(d2 => {
                  axios.get('http://localhost:8001/recursos/' + req.params.id + '?token=' + req.cookies.token)
                    .then(dados => {
                      var recurso = aux.prepararRecurso(dados.data, tipos_bd, req.cookies.token)
                      res.render('recurso', recurso)
                    })
                    .catch(error => res.render('error', {error}))
                  })
                  .catch(error => res.render('error', {error}))
              }
            })
            .catch(error => res.render('error', {error}))
        })
        .catch(error => res.render('error', {error}))
    }
    else res.redirect('/recursos/' + req.params.id)
  }
})
  
router.post('/upload', upload.single('zip'), function(req, res) {
  if (!req.cookies.token) aux.gerarTokenConsumidor(req.originalUrl, res)
  else {
    var token = aux.unveilToken(req.cookies.token)

    if (token.nivel == 'produtor' || token.nivel == 'admin') {
      var ficheiros = [];
      var tiposNovos = [];
      var total = 0
      var entradasZip = []
      var valido = true
      var zippath = (__dirname + req.file.path).replace("routes","").replace(/\\/g, "/")
      var extractpath = (__dirname + "uploads" ).replace("routes","").replace(/\\/g, "/")
      var zip = new AdmZip(zippath)

      zip.extractAllTo(extractpath)
      zip.getEntries().forEach(entry => {
        if(entry.entryName.match(/data\/.+/)){
          entradasZip[total++] = entry.name
        }
        else if (entry.entryName == "manifest-md5.txt") {
          let entries = entry.getData().toString().split("\n")
          entries.pop()
          entries.forEach(a=>{
            let separated = a.split(/ (.+)/ ,2)
            let hash = separated[0]
            let nome_ficheiro = separated[1].split("data/")[1]
            let diretoria = extractpath + ("/" + separated[1])
            let nova_diretoria = extractpath.replace("uploads","public/fileStore/") + Date.now() + "-" + nome_ficheiro
            let newhash = aux.calculateMd5(diretoria)

            ficheiros.push({
              nome_ficheiro: nome_ficheiro, 
              tipo_mime: aux.getMimeType(diretoria), 
              tamanho: aux.getSize(diretoria), 
              diretoria: nova_diretoria.split("app-server/")[1].replace(/^public/, ""), 
              hash: newhash
            })
            
            fs.rename(diretoria, nova_diretoria, err => { if (err) throw err })
            
            let pertence = false

            entradasZip.forEach(r => { if(r==nome_ficheiro) pertence = true })
            if(newhash != hash || !pertence) valido = false
          })
        }
      })

      if (valido) {
        var dataAtual = new Date().toISOString().substr(0,19)
        axios.get('http://localhost:8001/recursos/tipos?token=' + req.cookies.token)
          .then(tipos_bd => {
            var tipo = req.body.tipo
            
            if (tipo == "Outro") {
              tipo = req.body.outro_tipo
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

            var recurso = {
              tipo,
              titulo: req.body.titulo,
              descricao: req.body.descricao,
              dataCriacao: req.body.dataCriacao,
              dataRegisto: dataAtual,
              dataUltimaMod: dataAtual,
              visibilidade: req.body.visibilidade ? false : true,
              idAutor: token._id,
              nomeAutor: token.nome,
              ficheiros: ficheiros
            }

            aux.clearZipFolder(extractpath,zippath)
            
            axios.post('http://localhost:8001/recursos?token=' + req.cookies.token, {recurso, tiposNovos})
            .then(dados => {
              var novoRecurso = dados.data.dados
              
              if (novoRecurso.visibilidade) {
                axios.get('http://localhost:8001/users/imagem/' + token._id + '?token=' + req.cookies.token)
                  .then(foto => {
                    var noticia = {
                      autor: {
                        id: token._id,
                        nome: token.nome,
                        foto: foto.data.foto
                      },
                      recurso: {
                        id: novoRecurso._id,
                        titulo: novoRecurso.titulo,
                        tipo: novoRecurso.tipo,
                        estado: 'Novo'
                      },
                      data: dataAtual
                    }
    
                    axios.post('http://localhost:8001/noticias?token=' + req.cookies.token, noticia)
                      .then(d => res.redirect('/recursos'))
                      .catch(error => res.render('error', {error}))
                  })
                  .catch(error => res.render('error', {error}))
              }
              else res.redirect('/recursos')
            })
            .catch(error => res.render('error', {error}))
          })
          .catch(error => res.render('error', {error}))
      }
      else res.render('error', {error})
    }
    else res.redirect('/recursos')
  }
})

router.get('*', function(req,res) {
  res.redirect('/recursos')
})
  
module.exports = router;
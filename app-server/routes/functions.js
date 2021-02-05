var jwt = require('jsonwebtoken')
var keyToken = "TP_DAW2020"
var crypto = require("crypto")
var fs = require('fs')
var mime = require('mime-types')
var moment = require('moment')
var axios = require('axios')

function gerarTokenConsumidor(url, res) {
  axios.get('http://localhost:8000/users/consumidor')
    .then(dados => {
        res.cookie('token', dados.data.token, {
          expires: new Date(Date.now() + '1h'),
          secure: false,
          httpOnly: true
        })

        res.redirect(url)
    })
    .catch(error => res.render('error', {error}))
}

function unveilToken(token){  
    var t = null;
    
    jwt.verify(token,keyToken,function(e,decoded){
      if(e){
        console.log('Erro: ' + e)
        t = null
      }
      else{
        return t = decoded
      } 
    })

    return t
}

function getInfoToken(cookiesToken) {
  if (cookiesToken) {
    var token = unveilToken(cookiesToken)
    return {_id: token._id, nivel: token.nivel}
  }
  return {_id: null, nivel: 'consumidor'}
}

function variaveisRecursos(recursos, cookiesToken, meus_recursos) {
  var nomesAutores = []
  var idsAutores = []
  var tipos = []

  var token = unveilToken(cookiesToken)

  recursos.forEach(r => {
    r.tamanho = calculateSize(r.tamanho)
    r.dono = token._id == r.idAutor
    r.dataUltimaMod = moment(r.dataUltimaMod).format('HH:mm:ss, DD-MM-YYYY')
            
    if (!tipos.includes(r.tipo)) tipos.push(r.tipo)

    if (!idsAutores.includes(r.idAutor)) {
      idsAutores.push(r.idAutor)
      nomesAutores.push(r.nomeAutor)
    }
  })

  return {nivel: token.nivel, recursos, tipos, autores: nomesAutores.sort(), meus_recursos}
}

function prepararRecurso(r, tipos_bd, cookiesToken) {
  var token = unveilToken(cookiesToken)

  var tipos = []
  tipos_bd.data.forEach(t => tipos.push(t.tipo))

  var classif = r.classificacao
  r.dono = token._id == r.idAutor

  r.tamanho = calculateSize(r.tamanho)
  r.nrComentarios = r.comentarios.length
  r.classificacao = classif.reduce((total, prox) => total + prox.pontuacao, 0) / classif.length
  r.dataCriacao = moment(r.dataCriacao).format('DD-MM-YYYY')
  r.dataRegisto = moment(r.dataRegisto).format('HH:mm:ss, DD-MM-YYYY')
  r.dataUltimaMod = moment(r.dataUltimaMod).format('HH:mm:ss, DD-MM-YYYY')

  return {r, tipos, nivel: token.nivel}
}

function calculateSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  else {
    var kb = bytes/1024;
    if (kb < 1024) return `${(kb.toFixed(2))} KB`;
    else {
      var mb = kb/1024;
      if (mb < 1024) return `${(mb.toFixed(2))} MB`;

      return `${(mb/1024).toFixed(2)} GB`;
    }
  }
}

function calculateMd5(file){
  let file_buffer = fs.readFileSync(file);
  let sum = crypto.createHash('md5');
  sum.update(String(file_buffer));
  const hex = sum.digest('hex');
  return hex
}

function getSize(file){
  var stats = fs.statSync(file);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

function getMimeType(file){
  return mime.lookup(file)
}

function clearZipFolder(folder, zipfile){
  fs.rmSync(zipfile)
  fs.rmSync(folder + "\\\\data", {recursive:true})
  fs.rmSync(folder +"\\\\manifest-md5.txt",{recursive:true})
}

// obj1 = publicacoes, obj2 = noticias
function groupAndSortByDate(obj1,obj2){
  var grupo = {}
  obj1.forEach(o => {
    let dia = o.dataCriacao.split("T")[0]
    if(!(dia in grupo)) {
      grupo[dia] = []
    }
    grupo[dia].push(o)
  })
  obj2.forEach(o => {
    let dia = o.data.split("T")[0]
    if(!(dia in grupo)) {
      grupo[dia] = []
    }
    grupo[dia].push(o)
  })
  console.log(grupo)
  for(var [data, lista] of Object.entries(grupo)){
    lista.sort((a,b) => {
      let x1 = a.data ? a.data : a.dataCriacao
      let x2 = b.data ? b.data : b.dataCriacao
      return new Date(x2).getTime() - new Date(x1).getTime();
    })
  }
  var orderedDates = {}
  Object.keys(grupo).sort(function(a, b) {
    return moment(b, 'YYYY/MM/DD').toDate() - moment(a, 'YYYY/MM/DD').toDate();
    }).forEach(function(key) {
      orderedDates[key] = grupo[key];
    })
  return orderedDates
}

function sortComments(publicacao){
  publicacao.comments.sort((a,b) => {
    return new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime();
  })
}

function cleanTitle(title){
    return title.replace(/[/\\?%*:|"<>]/g, '-');
}

module.exports = {
  gerarTokenConsumidor,
  unveilToken,
  getInfoToken,
  variaveisRecursos,
  prepararRecurso,
  calculateSize,
  calculateMd5,
  getSize,
  getMimeType,
  clearZipFolder,
  groupAndSortByDate,
  sortComments,
  cleanTitle
}
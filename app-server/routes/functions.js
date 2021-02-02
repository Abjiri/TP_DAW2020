var jwt = require('jsonwebtoken')
var keyToken = "TP_DAW2020"
var crypto = require("crypto")
var fs = require('fs')
var mime = require('mime-types')
var moment = require('moment')

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

function variaveisRecursos(recursos, cookiesToken) {
  var token = unveilToken(cookiesToken)

  var nomesAutores = []
  var idsAutores = []
  var tipos = []

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

  return {auth: true, recursos, tipos, autores: nomesAutores.sort()}
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

module.exports = {
    unveilToken,
    variaveisRecursos,
    calculateSize,
    calculateMd5,
    getSize,
    getMimeType,
    clearZipFolder
}
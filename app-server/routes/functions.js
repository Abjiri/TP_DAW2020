var jwt = require('jsonwebtoken')
var keyToken = "TP_DAW2020"
var crypto = require("crypto")
var fs = require('fs')
var mime = require('mime-types')

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
    console.log("DECODE: " + JSON.stringify(t))
    return t
}

function calculateSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  else {
    var mb = bytes/1024;
    if (mb < 1024) return `${(mb.toFixed(2))} MB`;
    
    return `${(mb/1024).toFixed(2)} MB`;
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
  return fileSizeInBytes/1024;
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
    calculateSize,
    calculateMd5,
    getSize,
    getMimeType,
    clearZipFolder
}
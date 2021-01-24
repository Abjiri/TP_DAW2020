var jwt = require('jsonwebtoken')
var keyToken = "TP_DAW2020"

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

module.exports = {
    unveilToken,
    calculateSize
}
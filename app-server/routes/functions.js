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
  
function normalizePath(path){
    return path.split("public")[1].replace(/\\/g,"\/");
}

module.exports = {
    unveilToken,
    normalizePath
}
const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    nivel: {type: String, required: true},
    nome: String,
    estatuto: {
        tipo: String, 
        filiacao: String
    },
    dataRegisto: {type: String, default: new Date().toISOString().substr(0,10)},
    dataUltimoAcesso: String,
    descricao: String,
    foto: String
  });

module.exports = mongoose.model('user', userSchema)
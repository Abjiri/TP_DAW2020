const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    nivel: {type: String, required: true},
    nome: {type: String, required: true},
    estatuto: {
        tipo: {type: String, required: true},
        filiacao: {type: String, required: true},
    },
    dataRegisto: {type: String, default: new Date().toISOString().substr(0,19)},
    dataUltimoAcesso: {type: String, default: new Date().toISOString().substr(0,19)},
    descricao: {type: String, required: false},
    foto: {type: String, required: false},
    bloqueado: {type: Boolean, required: true, default: false}
  });

module.exports = mongoose.model('user', userSchema)
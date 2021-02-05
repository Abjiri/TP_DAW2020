const mongoose = require('mongoose')

var noticiaSchema = new mongoose.Schema({
  autor: {
    id: {type: String, required: true},
    nome: {type: String, required: true},
    foto: {type: String, required: true}
  },
  recurso: {
    id: {type: String, required: true},
    titulo: {type: String, required: true},
    tipo: {type: String, required: true},
    descricao: {type: String, required: false}
  },
  data: {type: String, default: new Date().toISOString().substr(0,19)}
});

module.exports = mongoose.model('noticia', noticiaSchema)
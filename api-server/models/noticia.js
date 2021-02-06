const mongoose = require('mongoose')

var noticiaSchema = new mongoose.Schema({
  autor: {type: {
    id: {type: String, required: true},
    nome: {type: String, required: true},
    foto: {type: String, required: true}
  }, required: true},
  recurso: {type: {
    id: {type: String, required: true},
    titulo: {type: String, required: true},
    tipo: {type: String, required: true},
    estado: {type: String, required: true}
  }, required: true},
  data: {type: String, default: new Date().toISOString().substr(0,19)}
});

module.exports = mongoose.model('noticia', noticiaSchema)
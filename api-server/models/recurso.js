const mongoose = require('mongoose')

var recursoSchema = new mongoose.Schema({
    tipo: {type: String, required: true},
    titulo: {type: String, required: true},
    descricao: {type: String, required: false},
    dataCriacao: {type: Date, required: true},
    dataRegisto: {type: Date, default: Date.now},
    visibilidade: {type: String, required: true},
    autor: {type: String, required: true},
    nome_ficheiro: {type: String, required: true},
    tamanho: {type: Number, required: true},
    tipo_mime: {type: String, required: true},
  });

module.exports = mongoose.model('recurso', recursoSchema)
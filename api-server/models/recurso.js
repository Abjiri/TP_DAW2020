const mongoose = require('mongoose')

var recursoSchema = new mongoose.Schema({
    tipo: { type: String, required: true },
    titulo: { type: String, required: true },
    subtitulo: { type: String, required: false },
    dataCriacao: String,
    dataRegisto: String,
    visibilidade: String,
    autor: String
  });

module.exports = mongoose.model('recurso', recursoSchema)
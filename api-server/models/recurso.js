const mongoose = require('mongoose')

var comentarioSchema = new mongoose.Schema({
  corpo: {type: String, required: true},
  id_autor: {type: String, required: true},
  dataCriacao: {type: String, default: new Date().toISOString().substr(0,19)}
});

var recursoSchema = new mongoose.Schema({
    tipo: {type: String, required: true},
    titulo: {type: String, required: true},
    descricao: {type: String, required: false},
    dataCriacao: {type: String, required: true},
    dataRegisto: {type: String, default: new Date().toISOString().substr(0,19)},
    dataUltimaMod: {type: String, default: new Date().toISOString().substr(0,19)},
    classificacao: {type: [{
        user: {type: String, required: true},
        pontuacao: {type: Number, required: true}
    }], default: []},
    visibilidade: {type: String, required: true},
    idAutor: {type: String, required: true},
    nomeAutor: {type: String, required: true},
    comentarios: {type: [comentarioSchema], default: []},
    nrDownloads: {type: Number, default: 0},
    nome_ficheiro: {type: String, required: true},
    tamanho: {type: Number, required: true},
    tipo_mime: {type: String, required: true},
    diretoria: {type: String, required: true}
  });

module.exports = mongoose.model('recurso', recursoSchema)
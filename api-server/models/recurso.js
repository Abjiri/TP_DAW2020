const mongoose = require('mongoose')

var ficheiroSchema = new mongoose.Schema({
  nome_ficheiro: {type: String, required: true},
  tamanho: {type: Number, required: true},
  tipo_mime: {type: String, required: true},
  diretoria: {type: String, required: true}, 
  hash: {type: String, required: true}
})

var recursoSchema = new mongoose.Schema({
    tipo: {type: String, required: true},
    titulo: {type: String, required: true},
    descricao: {type: String, required: false},
    dataCriacao: {type: String, required: true},
    dataRegisto: {type: String, required: true},
    dataUltimaMod: {type: String, required: true},
    classificacao: {type: [{
        user: {type: String, required: true},
        pontuacao: {type: Number, required: true}
    }], default: []},
    visibilidade: {type: Boolean, required: true},
    idAutor: {type: String, required: true},
    nomeAutor: {type: String, required: true},
    nrPubs: {type: Number, default: 0},
    nrDownloads: {type: Number, default: 0},
    ficheiros: {type: [ficheiroSchema], default: []}
  });

module.exports = mongoose.model('recurso', recursoSchema)
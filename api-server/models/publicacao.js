const mongoose = require('mongoose')

var comentarioSchema = new mongoose.Schema({
    corpo: {type: String, required: true},
    id_autor: {type: String, required: true},
    dataCriacao: {type: Date, required: true, default: Date.now}
});

var publicacaoSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    corpo: {type: String, required: true},
    recurso: {type: String, required: true},
    id_autor: {type: String, required: true},
    dataCriacao: {type: Date, required: true, default: Date.now},
    comments: {type: [comentarioSchema], required: true, default: []}
});


module.exports = mongoose.model('pub', publicacaoSchema)
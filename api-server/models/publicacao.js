const mongoose = require('mongoose')

var comentarioSchema = new mongoose.Schema({
    corpo: {type: String, required: true},
    id_autor: {type: String, required: true},
    nome_autor: {type: String, required: true}, 
    foto: {type: String, required: true},
    dataCriacao: {type: String, required: true, default: new Date().toISOString().substr(0,19)}
});

var publicacaoSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    corpo: {type: String, required: true},
    id_recurso: {type: String, required: true},
    titulo_recurso: {type: String, required: true},
    disp_recurso: {type: Boolean, required: true, default: true},
    id_autor: {type: String, required: true},
    nome_autor: {type: String, required: true}, 
    foto: {type: String, required: true},
    dataCriacao: {type: String, required: true, default: new Date().toISOString().substr(0,19)},
    comments: {type: [comentarioSchema], default: []}
});


module.exports = mongoose.model('pub', publicacaoSchema)
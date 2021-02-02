const mongoose = require('mongoose')

var noticiaSchema = new mongoose.Schema({
    idAutor: {type: String, required: true},
    nomeAutor: {type: String, required: true},
    recursos: {type: [{
        id: {type: String, required: true},
        titulo: {type: String, required: true},
        tipo: {type: String, required: true}
    }]},
    data: {type: String, default: new Date().toISOString().substr(0,19)}
  });

module.exports = mongoose.model('noticia', noticiaSchema)
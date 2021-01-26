// Controlador para o modelo Noticia

var Noticia = require('../models/noticia')

// lista as publicações
module.exports.listar = () => {
    return Noticia
        .find()
        .sort('-data')
        .exec()
}

module.exports.inserir = noticia => {
    return Noticia.insertMany(noticia)
}
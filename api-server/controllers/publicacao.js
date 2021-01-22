// Controlador para o modelo Publicacao

var Publicacao = require('../models/publicacao')

// lista as publicações
module.exports.listar = () => {
    return Publicacao
        .find()
        .sort('-dataCriacao')
        .exec()
}
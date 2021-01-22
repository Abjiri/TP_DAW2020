// Controlador para o modelo Recurso

var Recurso = require('../models/recurso')

// lista os recursos
module.exports.listar = () => {
    return Recurso
        .find()
        .sort('-data')
        .exec()
}

// lista os recursos do produtor
module.exports.listarAutor = email => {
    return Recurso
        .find({}, {autor: email})
        .sort('-dataRegisto')
        .exec()
}

module.exports.consultar = id => {
    return Recurso
        .findOne({_id: id})
        .exec()
}

module.exports.contar = () => {
    return Recurso
        .countDocuments()
        .exec()
}

module.exports.inserir = recursos => {
    return Recurso.insertMany(recursos)
}

module.exports.remover = function(id) {
    return Recurso.deleteOne({_id: id})
}

module.exports.alterar = function(r) {
    return Recurso.findByIdAndUpdate({_id: r._id}, r, {new: true})
}

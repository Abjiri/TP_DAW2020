// Controlador para o modelo Publicacao

var Publicacao = require('../models/publicacao')

// lista as publicações
module.exports.listar = () => {
    return Publicacao
        .find()
        .sort('-dataCriacao')
        .exec()
}

module.exports.consultar = id => {
    return Publicacao
        .findOne({_id: id})
        .exec()
}

module.exports.adicionarComentario = (id, com) => {
    return Publicacao
        .findOneAndUpdate(
            {_id: id},
            {$push: {comments: com}},
            {useFindAndModify: false, new: true}
        )
}

module.exports.pubsUtilizador = (id) => {
    return Publicacao
        .find({id_autor: id})
        .sort('-dataCriacao')
        .exec()
}

module.exports.atualizarFoto = (idAutor,foto) => {
    return Publicacao.updateMany(
        {id_autor: idAutor},
        {$set: {foto: foto}}
    )
}

module.exports.atualizarFotoComments = (idAutor,foto) => {
    return Publicacao.updateMany(
        {comments: {$elemMatch: {id_autor: idAutor}}},
        {$set: {"comments.$.foto": foto}}
    )
}

module.exports.inserir = t => {
    var novo = new Publicacao(t)
    return novo.save()
}
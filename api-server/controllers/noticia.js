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
    var nova = new Noticia(noticia)
    return nova.save()
}

module.exports.atualizarEstado = idRecurso => {
    return Noticia.updateMany(
        {"recurso.id": idRecurso},
        {$set: {'recurso.estado': 'Indisponível'}})
}

module.exports.atualizarFoto = (idUser,foto) => {
    return Noticia.updateMany(
        {"autor.id": idUser},
        {$set: {'autor.foto': foto}})
}

module.exports.noticiasUtilizador = id =>{
    return Noticia
        .find({"autor.id": id})
        .sort('-data')
        .exec()
}
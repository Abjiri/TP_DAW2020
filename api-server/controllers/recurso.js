// Controlador para o modelo Recurso

var Recurso = require('../models/recurso')

// lista os recursos
module.exports.listar = () => {
    return Recurso
        .aggregate([{
            $project: {
                titulo: 1,
                tipo: 1,
                idAutor: 1,
                nomeAutor: 1,
                nrComentarios: {$size: '$comentarios'},
                classificacao: {$round: [{$avg: '$classificacao.pontuacao'}, 0]},
                dataUltimaMod: 1,
                tamanho: 1,
                nrDownloads: 1,
                nome_ficheiro: 1,
                tipo_mime: 1
            }
        }])
        .sort('-_id')
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

module.exports.classificar = (idRecurso,classif) => {
    return Recurso.findOneAndUpdate(
        {"_id": idRecurso},
        {$push: {classificacao: classif}}, 
        {useFindAndModify: false, new: true})
}

module.exports.atualizarClassificacao = (idRecurso,classif) => {
    return Recurso.findOneAndUpdate(
        {"_id": idRecurso, "classificacao.user": classif.user},
        {$set: {'classificacao.$.pontuacao': classif.pontuacao}}, 
        {useFindAndModify: false, new: true})
}

module.exports.incrementarDownloads = (idRecurso) => {
    return Recurso.findOneAndUpdate(
        {"_id": idRecurso},
        {$inc: {nrDownloads: 1}}, 
        {useFindAndModify: false, new: true})
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

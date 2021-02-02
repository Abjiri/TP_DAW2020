// Controlador para o modelo Recurso
var Recurso = require('../models/recurso')

// lista os recursos
module.exports.listar = () => {
    return Recurso
        .aggregate([{
            $project: {
                _id: 1,
                titulo: 1,
                tipo: 1,
                idAutor: 1,
                nomeAutor: 1,
                nrComentarios: {$size: '$comentarios'},
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: 1,
                nrDownloads: 1,
                nome_ficheiro: 1,
                diretoria: 1,
                tipo_mime: 1
            }
        }])
        .sort('-_id')
}

// pesquisar recursos por autor
module.exports.pesquisarPorAutor = nome => {
    return Recurso
        .aggregate([
            { $match: { nomeAutor: { $regex: nome, $options: 'i'} } },
            { $project: {
                _id: 1,
                titulo: 1,
                tipo: 1,
                idAutor: 1,
                nomeAutor: 1,
                nrComentarios: {$size: '$comentarios'},
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: 1,
                nrDownloads: 1,
                nome_ficheiro: 1,
                diretoria: 1,
                tipo_mime: 1
            }
        }])
        .sort('-dataUltimaMod')
}

// pesquisar recursos por título
module.exports.pesquisarPorTitulo = titulo => {
    return Recurso
        .aggregate([
            { $match: { titulo: { $regex: titulo, $options: 'i'} } },
            { $project: {
                _id: 1,
                titulo: 1,
                tipo: 1,
                idAutor: 1,
                nomeAutor: 1,
                nrComentarios: {$size: '$comentarios'},
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: 1,
                nrDownloads: 1,
                nome_ficheiro: 1,
                diretoria: 1,
                tipo_mime: 1
            }
        }])
        .sort('-dataUltimaMod')
}

// pesquisar recursos por tipo
module.exports.pesquisarPorTipo = tipo => {
    return Recurso
        .aggregate([
            { $match: { tipo: { $regex: tipo, $options: 'i'} } },
            { $project: {
                _id: 1,
                titulo: 1,
                tipo: 1,
                idAutor: 1,
                nomeAutor: 1,
                nrComentarios: {$size: '$comentarios'},
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: 1,
                nrDownloads: 1,
                nome_ficheiro: 1,
                diretoria: 1,
                tipo_mime: 1
            }
        }, { $sort: {dataUltimaMod: -1} }])
}

// pesquisar recursos por ano de criação
module.exports.pesquisarPorAno = ano => {
    return Recurso
        .aggregate([
            { $match: { dataCriacao: new RegExp("^" + ano, "i") } },
            { $project: {
                _id: 1,
                titulo: 1,
                tipo: 1,
                idAutor: 1,
                nomeAutor: 1,
                nrComentarios: {$size: '$comentarios'},
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: 1,
                nrDownloads: 1,
                nome_ficheiro: 1,
                diretoria: 1,
                tipo_mime: 1
            }
        }])
        .sort('-dataUltimaMod')
}

// ordenar recursos por um critério
module.exports.ordenarPor = params => {
    var criteriosArr = [{"chave": "titulo", "valor": 1}]
    criteriosArr.unshift({"chave": params.criterio, "valor": parseInt(params.sentido)})
    
    var criteriosObj = criteriosArr.reduce(
        (obj, item) => Object.assign(obj, { [item.chave]: item.valor }), {});
        
    return Recurso
        .aggregate([{
            $project: {
                _id: 1,
                titulo: 1,
                tipo: 1,
                idAutor: 1,
                nomeAutor: 1,
                nrComentarios: {$size: '$comentarios'},
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: 1,
                nrDownloads: 1,
                nome_ficheiro: 1,
                diretoria: 1,
                tipo_mime: 1
            }
        }, { $sort: criteriosObj }])
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

module.exports.incrementarDownloads = dir => {
    return Recurso.findOneAndUpdate(
        { diretoria: dir },
        { $inc: { nrDownloads: 1 } }
    )
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

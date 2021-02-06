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
                tamanho: {$round: [{$sum: '$ficheiros.tamanho'}, 0]},
                nrDownloads: 1
            }
        }])
        .sort('-dataUltimaMod')
}

// pesquisar "meus" recursos
module.exports.pesquisarMeusRecursos = idAutor => {
    return Recurso
        .aggregate([
            { $match: { idAutor } },
            { $project: {
                _id: 1,
                titulo: 1,
                tipo: 1,
                idAutor: 1,
                nomeAutor: 1,
                nrComentarios: {$size: '$comentarios'},
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: {$round: [{$sum: '$ficheiros.tamanho'}, 0]},
                nrDownloads: 1
            }
        }])
        .sort('-dataUltimaMod')
}

// pesquisar recursos por autor
module.exports.pesquisarPorAutor = (nome, meus_recursos) => {
    var nomeAutor = { $regex: nome, $options: 'i'}
    var matchObj
    
    if (meus_recursos) matchObj = { idAutor: meus_recursos, nomeAutor }
    else matchObj = {nomeAutor}

    return Recurso
        .aggregate([
            { $match: matchObj },
            { $project: {
                _id: 1,
                titulo: 1,
                tipo: 1,
                idAutor: 1,
                nomeAutor: 1,
                nrComentarios: {$size: '$comentarios'},
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: {$round: [{$sum: '$ficheiros.tamanho'}, 0]},
                nrDownloads: 1
            }
        }])
        .sort('-dataUltimaMod')
}

// pesquisar recursos por título
module.exports.pesquisarPorTitulo = (titulo, meus_recursos) => {
    var titulo = { $regex: titulo, $options: 'i'}
    var matchObj
    
    if (meus_recursos) matchObj = { idAutor: meus_recursos, titulo }
    else matchObj = {titulo}
    
    return Recurso
        .aggregate([
            { $match: matchObj },
            { $project: {
                _id: 1,
                titulo: 1,
                tipo: 1,
                idAutor: 1,
                nomeAutor: 1,
                nrComentarios: {$size: '$comentarios'},
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: {$round: [{$sum: '$ficheiros.tamanho'}, 0]},
                nrDownloads: 1
            }
        }])
        .sort('-dataUltimaMod')
}

// pesquisar recursos por tipo
module.exports.pesquisarPorTipo = (tipo, meus_recursos) => {
    var tipo = { $regex: tipo, $options: 'i'}
    var matchObj
    
    if (meus_recursos) matchObj = { idAutor: meus_recursos, tipo }
    else matchObj = {tipo}
    
    return Recurso
        .aggregate([
            { $match: matchObj },
            { $project: {
                _id: 1,
                titulo: 1,
                tipo: 1,
                idAutor: 1,
                nomeAutor: 1,
                nrComentarios: {$size: '$comentarios'},
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: {$round: [{$sum: '$ficheiros.tamanho'}, 0]},
                nrDownloads: 1
            }
        }, { $sort: {dataUltimaMod: -1} }])
}

// pesquisar recursos por ano de criação
module.exports.pesquisarPorAno = (ano, meus_recursos) => {
    var dataCriacao = { $regex: "^"+ano, $options: 'i'}
    var matchObj
    
    if (meus_recursos) matchObj = { idAutor: meus_recursos, dataCriacao }
    else matchObj = {dataCriacao}
    
    return Recurso
        .aggregate([
            { $match: matchObj },
            { $project: {
                _id: 1,
                titulo: 1,
                tipo: 1,
                idAutor: 1,
                nomeAutor: 1,
                nrComentarios: {$size: '$comentarios'},
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: {$round: [{$sum: '$ficheiros.tamanho'}, 0]},
                nrDownloads: 1
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
                tamanho: {$round: [{$sum: '$ficheiros.tamanho'}, 0]},
                nrDownloads: 1
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

module.exports.editarRecurso = (id, novos) => {
    console.log(novos)
    return Recurso.findOneAndUpdate(
        {"_id": id},
        { $set: {
            'titulo': novos.titulo,
            'descricao': novos.descricao,
            'tipo': novos.tipo,
            'visibilidade': novos.visibilidade
                }
        }, 
        {useFindAndModify: false, new: true})
}

module.exports.incrementarDownloads = dir => {
    return Recurso.findOneAndUpdate(
        { diretoria: dir },
        { $inc: { nrDownloads: 1 } }
    )
}

module.exports.inserir = recurso => {
    var novoRec = new Recurso(recurso)
    return novoRec.save()
}

module.exports.remover = function(id) {
    return Recurso.deleteOne({_id: id})
}

module.exports.alterar = function(r) {
    return Recurso.findByIdAndUpdate({_id: r._id}, r, {new: true})
}

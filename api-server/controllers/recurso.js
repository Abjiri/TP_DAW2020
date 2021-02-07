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
                visibilidade: 1,
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: {$sum: '$ficheiros.tamanho'},
                nrPubs: 1,
                nrDownloads: 1
            }
        }])
        .sort('-dataUltimaMod')
}

module.exports.listarPorIDs = ids =>{
    return Recurso
        .find()
        .where('_id').in(ids)
        .exec()
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
                visibilidade: 1,
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: {$sum: '$ficheiros.tamanho'},
                nrPubs: 1,
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
                visibilidade: 1,
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: {$sum: '$ficheiros.tamanho'},
                nrPubs: 1,
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
                visibilidade: 1,
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: {$sum: '$ficheiros.tamanho'},
                nrPubs: 1,
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
                visibilidade: 1,
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: {$sum: '$ficheiros.tamanho'},
                nrPubs: 1,
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
                visibilidade: 1,
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: {$sum: '$ficheiros.tamanho'},
                nrPubs: 1,
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
                visibilidade: 1,
                classificacao: {$ifNull: [{$round: [{$avg: '$classificacao.pontuacao'}, 0]}, 0]},
                dataUltimaMod: 1,
                tamanho: {$sum: '$ficheiros.tamanho'},
                nrPubs: 1,
                nrDownloads: 1
            }
        }, { $sort: criteriosObj }])
}

module.exports.consultar = id => {
    return Recurso
        .findOne({_id: id},
            {
                _id: 1,
                titulo: 1,
                tipo: 1,
                descricao: 1,
                dataCriacao: 1,
                dataRegisto: 1,
                dataUltimaMod: 1,
                idAutor: 1,
                nomeAutor: 1,
                comentarios: 1,
                visibilidade: 1,
                classificacao: 1,
                visibilidade: 1,
                tamanho: {$sum: '$ficheiros.tamanho'},
                ficheiros: 1,
                nrPubs: 1,
                nrDownloads: 1
            })
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

module.exports.editarRecursoTirar = (id, novos) => {
    return Recurso.updateOne(
        {"_id": id},
        {$pull: {ficheiros: {_id: {$in: novos.removerFicheiros}}}},
        {multi: true}
    ).exec()
}

module.exports.editarRecursoAdicionar = (id,novos) => {
    return Recurso.findOneAndUpdate(
        {"_id": id},
        { $set: {
            'titulo': novos.titulo,
            'descricao': novos.descricao,
            'tipo': novos.tipo,
            'visibilidade': novos.visibilidade
            },
          $push: { ficheiros: { $each: novos.ficheiros } }
        },
        {useFindAndModify: false, new: true}
    ).exec()
}

module.exports.consultarTitulo = id => {
    return Recurso
        .findOne({_id: id}, {titulo: 1, _id: 0})
        .exec()
}

module.exports.incrementarDownloads = id => {
    return Recurso.findOneAndUpdate(
        { _id: id },
        { $inc: { nrDownloads: 1 } }, 
        {useFindAndModify: false, new: true}
    )
}

module.exports.incrementarPubs = id => {
    return Recurso.findOneAndUpdate(
        { _id: id },
        { $inc: { nrPubs: 1 } }, 
        {useFindAndModify: false, new: true}
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

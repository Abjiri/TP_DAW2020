// Controlador para o modelo RecursoTipo

var RecursoTipo = require('../models/tipo_recurso')

// lista as publicações
module.exports.listar = () => {
    return RecursoTipo
        .find({}, {_id: 0, tipo: 1})
        .sort({tipo: 1})
        .exec()
}

module.exports.inserir = tipos => {
    return RecursoTipo.insertMany(tipos)
}
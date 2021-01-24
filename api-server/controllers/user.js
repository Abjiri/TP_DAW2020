// Controlador para o modelo Utilizador

var User = require('../models/user')

// lista os utilizadores
module.exports.listar = () => {
    return User
        .find()
        .sort('+nome')
        .exec()
}

module.exports.consultar = id => {
    return User
        .findOne({_id: id})
        .exec()
}

module.exports.contar = () => {
    return User
        .countDocuments()
        .exec()
}

module.exports.inserir = t => {
    var novo = new User(t)
    return novo.save()
}

module.exports.remover = id => {
    return User.deleteOne({_id: id})
}

module.exports.alterar = t => {
    return User.findByIdAndUpdate({_id: t._id}, t, {new: true})
}
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}


let Schema = mongoose.Schema


let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria'],

    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

})


usuarioSchema.methods.toJSON = function() {
    let user = this
    let userOBject = user.toObject()
    delete userOBject.password
    return userOBject
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
})


module.exports = mongoose.model('Usuario', usuarioSchema)
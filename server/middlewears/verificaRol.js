const jwt = require('jsonwebtoken')

// ==============
// Verificar Admin Rol
// ===============

let verificaRol = (req, res, next) => {

    let usuario = req.usuario


    if (usuario.role === 'ADMIN_ROLE') {
        next()
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }
}


module.exports = {
    verificaRol
}
const jwt = require('jsonwebtoken')

// ==============
// Verificar token
// ===============

let verificaToken = (req, res, next) => {

    let token = req.get('Authorization')
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario
        next()
    })
}

// ==============
// Verificar token
// ===============

let verificaTokenUrl = (req, res, next) => {

    let token = req.query.token
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario
        next()
    })
}


module.exports = {
    verificaToken,
    verificaTokenUrl
}
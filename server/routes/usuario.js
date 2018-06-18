const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const Usuario = require('../models/usuario')
const { verificaToken } = require('../middlewears/authentication')
const { verificaRol } = require('../middlewears/verificaRol')

const app = express()

app.get('/usuario', verificaToken, (req, res) => {


    let desde = req.query.desde || 0
    let limite = req.query.limite || 5

    Usuario.find({ estado: true }, 'nombre email img estado')
        .skip(Number(desde))
        .limit(Number(limite))
        .exec((err, usuarios) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }


            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })
            })
        })
})

app.post('/usuario', [verificaToken, verificaRol], (req, res) => {

    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuarioDB
        })


    })
})

app.put('/usuario/:id', [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario
        })
    })
})

app.delete('/usuario/:id', [verificaToken, verificaRol], (req, res) => {

    let id = req.params.id


    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) {
            res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            })
        }


        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })

})

module.exports = app
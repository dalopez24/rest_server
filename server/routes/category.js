const express = require('express')
const Category = require('../models/categoria')

let { verificaToken } = require('../middlewears/authentication')
const { verificaRol } = require('../middlewears/verificaRol')
let app = express()

app.get('/categorias', verificaToken, (req, res) => {

    Category.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categorias
            })
        })
})


app.get('/categorias/:id', verificaToken, (req, res) => {

    let id = req.params.id
    Category.find({ _id: id }).exec((err, categoria) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria
        })
    })
})


app.post('/categorias', verificaToken, (req, res) => {

    let body = req.body
    let usuario = req.usuario

    let categoria = new Category({
        descripcion: body.descripcion,
        usuario: usuario._id

    })


    categoria.save((err, categoriaDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoriaDb
        })

    })
})


app.put('/categorias/:id', [verificaToken, verificaRol], (req, res) => {

    let id = req.params.id
    let body = req.body

    let categoria = {
        descripcion: body.descripcion
    }

    Category.findByIdAndUpdate(id, categoria, { new: true }, (err, categoriaActualizada) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaActualizada) {
            res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no encontrada"
                }
            })
        }


        res.json({
            ok: true,
            usuario: categoriaActualizada
        })
    })

})

app.delete('/categorias/:id', [verificaToken, verificaRol], (req, res) => {

    let id = req.params.id

    Category.findOneAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaBorrada) {
            res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no encontrado"
                }
            })
        }


        res.json({
            ok: true,
            usuario: categoriaBorrada
        })
    })

})


module.exports = app
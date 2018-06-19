const express = require('express')
const { verificaToken } = require('../middlewears/authentication')
const { verificaRol } = require('../middlewears/verificaRol')

let app = express()
let Producto = require('../models/producto')



app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0
    let limite = req.query.limite || 10

    Producto.find()
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email role estado google')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }


            res.json({
                ok: true,
                productos
            })

        })
})



app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Producto.find({ _id: id })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email role estado google')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }


            res.json({
                ok: true,
                productos
            })

        })
})


app.get('/productos/buscar/:termino', verificaToken, (req, res) => {


    let termino = req.params.termino
    let regex = new RegExp(termino, 'i')
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos: productoDB
            })

        })


})



app.post('/productos', verificaToken, (req, res) => {


    let body = req.body
    let userid = req.usuario._id

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: userid
    })

    producto.save((err, productoDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDb
        })
    })


})


app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id
    let body = req.body

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro el producto'
                }
            })
        }


        res.json({
            ok: true,
            producto: productoDB
        })


    })
})




app.delete('/productos/:id', [verificaToken, verificaRol], (req, res) => {


    let id = req.params.id

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro el producto'
                }
            })
        }


        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

module.exports = app
const express = require('express')
const fileUpload = require('express-fileupload')
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')

const app = express()
const path = require('path')
    // default options
app.use(fileUpload())

app.put('/upload/:id/:tipo', (req, res) => {

    let id = req.params.id
    let tipo = req.params.tipo



    if (!req.files)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        })


    let tiposValidos = ['productos', 'usuarios']

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
                ext: tiposValidos.join(', ')
            }
        })
    }

    let archivoPorSubir = req.files.archivo

    let extensionesValidas = ['jpg', 'png', 'jpeg', 'gif']
    let nombreArchivo = archivoPorSubir.name.split('.')
    let extension = nombreArchivo[nombreArchivo.length - 1]

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas',
                ext: extensionesValidas.join(', ')
            }
        })
    }


    let nombreArch = `${id}-${new Date().getMilliseconds()}.${extension}`
    archivoPorSubir.mv(`uploads\\${tipo}\\${nombreArch}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })

        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArch)
                break
            case 'productos':
                imagenProducto(id, res, nombreArch)
                break
        }
    })
})


function imagenUsuario(id, res, nombreArch) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borrarArchivo(nombreArch, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArch, 'usuarios')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }

        borrarArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArch
        usuarioDB.save((err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario,
                img: nombreArch
            })
        })
    })

}

function imagenProducto(id, res, nombreArch) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borrarArchivo(nombreArch, 'productos')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borrarArchivo(nombreArch, 'productos')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        borrarArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArch
        productoDB.save((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto,
                img: nombreArch
            })
        })
    })

}



function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen)
    }
}

module.exports = app
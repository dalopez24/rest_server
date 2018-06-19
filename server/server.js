require('./config/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./routes/index'))


//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))


mongoose.connect(process.env.URL_DB, (err, res) => {
    if (err) throw err

    console.log('Base de datos en linea');

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto 3000');
})
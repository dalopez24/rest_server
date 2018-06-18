// =========================
// Puerto
// =========================

process.env.PORT = process.env.PORT || 3000

// =========================
// Entorno
// =========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


let urlDb
if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://localhost:27017/cafe'
} else {
    urlDb = process.env.MONGO_URI
}
process.env.URL_DB = urlDb


// =========================
// Vencimiento del token
// =========================

process.env.CADUCIDAD_TOKEN = '30d'

// =========================
// SEED de autenticacion
// =========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'
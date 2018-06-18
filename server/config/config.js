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
    urlDb = 'mongodb://cafeUser:Daniel123()@ds163680.mlab.com:63680/cafenode'
}


process.env.URL_DB = urlDb
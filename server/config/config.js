//  PUERTO
if (process.env.NODE_ENV == 'prod') {
    process.env.PORT = 3002;
} else {
    process.env.PORT = 3000
}
// process.env.PORT = process.env.PORT || 3002;

//URL DEL SERVICIO

process.env.URL_SERVICE = process.env.URL_SERVICE || 'http://localhost:'

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev;'


//base de datos
let urlDB;
if (process.env.NODE_ENV == 'prod') {
    urlDB = 'mongodb://localhost:27017/zing';
} else {
    urlDB = 'mongodb://sa:Bintech123@ds211143.mlab.com:11143/zing'
}


process.env.URLDB = urlDB;

// ============================
//  Vencimiento del Token
// ============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ============================
//  SEED de autenticación
// ============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ===========================
//  direcciones success y cancel para paypal
// ===========================
if (process.env.NODE_ENV == 'prod') {
    process.env.URL_SERVICE = 'http://18.217.143.92:3000/';

} else {
    process.env.URL_SERVICE = 'https://zzing.herokuapp.com/';
}
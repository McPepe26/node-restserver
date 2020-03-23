// ================================
// Puerto
// ================================
process.env.PORT = process.env.PORT || 3000;

// ================================
// Entorno
// ================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================
// Base de datos
// ================================
let urlDB;
if(process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else
    urlDB = process.env.MONGO_URI;

process.env.URLDB = urlDB;

// ================================
// Vencimiento del token
// ================================
process.env.CADUCIDAD_TOKEN = 60*60*24*30;

// ================================
// SEED de autenticación
// ================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ================================
// Google client ID
// ================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '296715129945-4rc2m6ffcu97dlfa6r83ep7fr8r7rmrf.apps.googleusercontent.com';

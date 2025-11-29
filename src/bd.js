const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err) => {
    if (err) {
        console.error('Error en la conexión con la BD: ', err.stack);
        return;
    }
    console.log('Conectado a la BD, id:  ' + connection.threadId);
});
module.exports = connection;


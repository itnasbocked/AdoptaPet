const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const rutaMascota = require('./src/rutas/rutaMascota')
const rutaUsuario = require('./src/rutas/rutaUsuario');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/mascota', rutaMascota);
app.use('/api/usuarios', rutaUsuario);

//------------------------------------Rutas de archivos HTML - Inicio

//Ruta principal
app.get('/', (req, res) => {
    // Si index.html está en /public/Main/index.html
    res.sendFile(path.join(__dirname, 'public', 'Main', 'index.html'));
});


// Rutas públicas
app.get('/catalogo', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Catálogo', 'catalogo.html'));
});
app.get('/acerca-de', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Acerca de', 'acerca.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Iniciar Sesión', 'login-register.html'));
});


// Rutas de usuario
app.get('/perfil-usuario', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Perfil de Usuario', 'perfil-usuario.html'));
});
app.get('/detalles-mascota', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Información de Mascota', 'info.html'));
});
app.get('/formulario-adopcion', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Formulario de Adopción', 'forms.html'));
});
app.get('/confirmacion-adopcion', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Confirmación de Envío', 'confirmacion.html'));
});


// Rutas de administrador
app.get('/crud-mascotas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'CRUD de Mascotas', 'crud-mascotas.html'));
});
app.get('/crud-usuarios', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'CRUD de Usuarios', 'crud-usuarios.html'));
});
app.get('/crud-solicitudes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'CRUD de Solicitudes', 'crud-solicitudes.html'));
});
//------------------------------------Rutas de archivos HTML - Final

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    require('./src/bd')
});
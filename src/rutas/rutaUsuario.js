const express = require('express');
const router = express.Router();
const userController = require('../controladores/controladorUsuario');

// Ruta para registrar un nuevo usuario
router.post('/register', userController.register);

// Ruta para iniciar sesión
router.post('/login', userController.login);

module.exports = router;
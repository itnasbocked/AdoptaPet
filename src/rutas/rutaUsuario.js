const express = require('express');
const router = express.Router();
const userController = require('../controladores/controladorUsuario');
const middleware = require('../middleware/middleware');

// Ruta para registrar un nuevo usuario
router.post('/register', userController.register);

// Ruta para iniciar sesión
router.post('/login', userController.login);

// CRUD ADMIN 
router.get('/', middleware.isAdmin, userController.obtenerUsuarios);
router.put('/:id', middleware.isAdmin, userController.editarUsuario);
router.delete('/:id', middleware.isAdmin, userController.eliminarUsuario);

module.exports = router;
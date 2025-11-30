const express = require('express');
const router = express.Router();
const controladorSolicitudes = require('../controladores/controladorSolicitudes');
const middleware = require('../middleware/middleware');

// OBTENER TODAS LAS SOLICITUDES 
router.get('/', middleware.isAdmin, controladorSolicitudes.obtenerSolicitudes);

// CREAR SOLICITUD 
router.post('/', controladorSolicitudes.crearSolicitud);

// ACTUALIZAR ESTADO 
router.put('/:id', middleware.isAdmin, controladorSolicitudes.actualizarEstado);

// ELIMINAR SOLICITUD 
router.delete('/:id', middleware.isAdmin, controladorSolicitudes.eliminarSolicitud);

module.exports = router;

const express = require('express');
const router = express.Router();
const controladorSolicitudes = require('../controladores/controladorSolicitudes');
const middleware = require('../middleware/middleware');

router.get('/', middleware.isAdmin, controlSolicitudes.obtenerSolicitudes); 

router.put('/:id', middleware.isAdmin, controlSolicitudes.actualizarEstado); 

module.exports = router;

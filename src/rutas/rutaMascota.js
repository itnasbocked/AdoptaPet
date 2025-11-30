const express = require('express');
const router = express.Router();
const mascotaControl = require('../controladores/controladorMascota');
const middleware = require('../middleware/middleware');

router.get('/mascotas', mascotaControl.obtenerMascotas);
router.post('/mascotas', middleware.isAdmin, mascotaControl.crearMascota);
router.put('/mascotas/:id', middleware.isAdmin, mascotaControl.editarMascota);
router.delete('/mascotas/:id', middleware.isAdmin, mascotaControl.eliminarMascota);

module.exports = router;

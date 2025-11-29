const express = require('express');
const router = express.Router();
const mascotaControl = require('../controladores/controladorMascota');

router.get('/mascotas', mascotaControl.obtenerMascotas);
module.exports = router;

const bd = require('../bd');

exports.obtenerMascotas = (req, res) => {
    const query = 'SELECT mascota_id, nombre, especie, raza, edad_anios, tamano FROM mascota WHERE disponible = 1';
    bd.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener mascotas: ', error);
            return res.status(500).json({ error: 'Error al obtener mascotas' });
        }
        res.json(results);
    });
};


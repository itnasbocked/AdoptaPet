const bd = require('../bd');

exports.obtenerMascotas = (req, res) => {
    const query = 'SELECT mascota_id, nombre, especie, raza, edad_anios, tamano, estado_salud, estado_adopcion FROM mascota WHERE disponible = 1';
    bd.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener mascotas: ', error);
            return res.status(500).json({ error: 'Error al obtener mascotas' });
        }
        res.json(results);
    });
};

exports.crearMascota = (req, res) => {
    const { nombre, raza, especie, edad_anios, tamano, estado_salud, estado_adopcion } = req.body; 

    if (!nombre || !especie) {
        return res.status(400).json({ message: 'El nombre y la especie son obligatorios.' });
    }

    const sql = `INSERT INTO mascota 
        (nombre, especie, raza, edad_anios, tamano, estado_salud, esterilizado, vacunado, disponible, estado_adopcion)
        VALUES (?, ?, ?, ?, ?, ?, 1, 1, 1, ?)`;
    
    const params = [
        nombre,
        especie,
        raza === "" ? null : raza,
        edad_anios === "" ? null : edad_anios, 
        tamano || null,
        estado_salud || 'Desconocido',
        estado_adopcion || 'disponible'
    ];

    bd.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error al crear mascota:', err);
            return res.status(500).json({ message: 'Error interno al guardar la mascota.' });
        }
        res.status(201).json({ message: 'Mascota creada con éxito', id: result.insertId });
    });
};

exports.editarMascota = (req, res) => {
    const mascotaId = req.params.id; 

    let { nombre, raza, especie, edad_anios, tamano, estado_salud, disponible, estado_adopcion } = req.body;

    const sql = `
        UPDATE mascota
        SET 
            nombre = ?, 
            raza = ?, 
            especie = ?, 
            edad_anios = ?, 
            tamano = ?, 
            estado_salud = ?, 
            disponible = ?,
            estado_adopcion = ?
        WHERE mascota_id = ?
    `;

    if (disponible === undefined || disponible === null || disponible === "") {
        disponible = 1; 
    }

    const params = [
        nombre,
        raza === "" ? null : raza,
        especie,
        edad_anios === "" ? null : edad_anios,
        tamano === "" ? null : tamano,
        estado_salud === "" ? null : estado_salud,
        disponible,
        estado_adopcion || 'disponible',
        mascotaId];

    bd.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error al editar mascota:', err);
            return res.status(500).json({ message: 'Error interno al actualizar la mascota.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Mascota no encontrada para editar.' });
        }
        res.json({ message: 'Mascota actualizada con éxito.' });
    });
};

exports.eliminarMascota = (req, res) => {
    const mascotaId = req.params.id;

    const sql = 'DELETE FROM mascota WHERE mascota_id = ?';
    bd.query(sql, [mascotaId], (err, result) => {
        if (err) {
            console.error('Error al eliminar mascota:', err);
            return res.status(500).json({ message: 'Error interno al eliminar la mascota.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Mascota no encontrada para eliminar.' });
        }
        res.json({ message: 'Mascota eliminada con éxito.' });
    });
};

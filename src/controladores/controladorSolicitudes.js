const bd = require('../bd');

exports.obtenerSolicitudes = (req, res) => {
    const sql = `
        SELECT s.solicitud_id, s.creada_en, m.nombre AS mascota_nombre, 
               u.nombre AS solicitante_nombre, e.nombre AS estado
        FROM solicitud_adopcion s
        JOIN mascota m ON s.mascota_id = m.mascota_id
        JOIN usuario u ON s.usuario_id = u.usuario_id
        JOIN estado_solicitud e ON s.estado_id = e.estado_id
        ORDER BY s.creada_en DESC
    `;
    bd.query(sql, (error, results) => {
        if (error) {
            console.error('Error al obtener solicitudes:', error);
            return res.status(500).json({ error: 'Error interno al cargar solicitudes.' });
        }
        res.json(results);
    });
};

exports.actualizarEstado = (req, res) => {
    const solicitudId = req.params.id;
    const { nuevo_estado_id } = req.body; 
    
    const sql = `⁠UPDATE solicitud_adopcion SET estado_id = ?, resuelta_en = NOW() WHERE solicitud_id = ?`;
    
    bd.query(sql, [nuevo_estado_id, solicitudId], (err, result) => {
        if (err) {
            console.error('Error al actualizar estado:', err);
            return res.status(500).json({ message: 'Error interno al actualizar estado.' });
        }
        res.json({ message: 'Estado actualizado con éxito.' });
    });
};


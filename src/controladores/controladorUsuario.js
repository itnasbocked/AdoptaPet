const bd = require('../bd');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'BTFj/zE+bFms6oKwJ07yEpDbKCBYv1P0QHXh17qucb0=';

//Registro
exports.register = async (req, res) => {
    console.log('Datos recibidos del Frontend (req.body):', req.body);
    const { nombre, email, password, telefono } = req.body; 

    if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); 
        
        const sql = 'INSERT INTO usuario (nombre, email, password_hash, telefono, rol_id, activo) VALUES (?, ?, ?, ?, 2, 1)';

        bd.query(sql, [nombre, email, hashedPassword, telefono], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'El email ya está registrado.' });
                }
                console.error('Error en bd al registrar:', err);
                return res.status(500).json({ message: 'Error interno del servidor.' });
            }
            res.status(201).json({ message: 'Usuario registrado con éxito.' });
        });
        
    } catch (error) {
        console.error('Error al hashear o procesar registro:', error);
        res.status(500).json({ message: 'Error al procesar el registro.' });
    }
};

//Login
exports.login = (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT usuario_id, password_hash, rol_id FROM usuario WHERE email = ?';

    bd.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error interno.' });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }
        
        const user = results[0];
        const match = await bcrypt.compare(password, user.password_hash);
        
        if (!match) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }

        const token = jwt.sign(
            { id: user.usuario_id, rol: user.rol_id }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ 
            message: 'Inicio de sesión exitoso.', 
            token: token,
            rol_id: user.rol_id
        });
    });
};

// Actualizar perfil de usuario
// exports.updateProfile = (req, res) => {
//     const userId = req.user ? req.user.id : 1; 

//     const { nombre, apellido, telefono, direccion } = req.body;

//     const sqlUpdateUsuario = `
//         UPDATE usuario 
//         SET nombre = ?, telefono = ? 
//         WHERE usuario_id = ?`;
//     const paramsUsuario = [nombre, telefono, userId];

//     const sqlUpdatePerfil = `
//         INSERT INTO usuario_perfil (usuario_id, apellido, direccion) 
//         VALUES (?, ?, ?)
//         ON DUPLICATE KEY UPDATE apellido = VALUES(apellido), direccion = VALUES(direccion)`;
//     const paramsPerfil = [userId, apellido, direccion];

//     bd.query(sqlUpdateUsuario, paramsUsuario, (err, resultUsuario) => {
//         if (err) {
//             console.error('Error al actualizar tabla usuario:', err);
//             return res.status(500).json({ message: 'Error interno al actualizar datos principales.' });
//         }
        
//         bd.query(sqlUpdatePerfil, paramsPerfil, (err, resultPerfil) => {
//             if (err) {
//                 console.error('Error al actualizar tabla perfil:', err);
//                 return res.status(500).json({ message: 'Error interno al actualizar detalles del perfil.' });
//             }
            
//             res.json({ message: 'Perfil actualizado con éxito.' });
//         });
//     });
// };

//___________________CRUD_______________________________

exports.obtenerUsuarios = (req, res) => {
    const sql = `
        SELECT usuario_id, nombre, email, telefono, rol_id, activo
        FROM usuario
    `;
    bd.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ message: 'Error interno.' });
        }
        res.json(results);
    });
};

exports.editarUsuario = (req, res) => {
    const usuarioId = req.params.id;
    const { rol_id, activo } = req.body;

    if (rol_id === undefined && activo === undefined) {
        return res.status(400).json({ message: 'No se proporcionaron campos para actualizar.' });
    }

    // Armamos el UPDATE dinámicamente según lo que llegue
    let campos = [];
    let valores = [];

    if (rol_id !== undefined) {
        campos.push('rol_id = ?');
        valores.push(rol_id);
    }

    if (activo !== undefined) {
        campos.push('activo = ?');
        valores.push(activo);
    }

    const sql = `
        UPDATE usuario
        SET ${campos.join(', ')}
        WHERE usuario_id = ?
    `;
    valores.push(usuarioId);

    bd.query(sql, valores, (err, result) => {
        if (err) {
            console.error('Error al editar usuario:', err);
            return res.status(500).json({ message: 'Error interno.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json({ message: 'Usuario actualizado con éxito.' });
    });
};

exports.eliminarUsuario = (req, res) => {
    const usuarioId = req.params.id;

    const sql = 'DELETE FROM usuario WHERE usuario_id = ?';

    bd.query(sql, [usuarioId], (err, result) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            return res.status(500).json({ message: 'Error interno.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json({ message: 'Usuario eliminado con éxito.' });
    });
};
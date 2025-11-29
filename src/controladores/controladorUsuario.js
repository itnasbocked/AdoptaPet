const bd = require('../bd');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'TU_CLAVE_SECRETA_SUPER_LARGA';

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
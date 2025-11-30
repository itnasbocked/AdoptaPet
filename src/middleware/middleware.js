const jwt = require('jsonwebtoken');
const JWT_SECRET = 'BTFj/zE+bFms6oKwJ07yEpDbKCBYv1P0QHXh17qucb0='; 

exports.protect = (requiredRole) => (req, res, next) => {
    const authHeader = req.headers.authorization;
    const headerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    const queryToken = req.query.t;

    const token = headerToken || queryToken;

    if (!token) {
        return res.status(401).json({ message: 'Token de sesión no proporcionado. Acceso denegado.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (decoded.rol !== requiredRole) {
            return res.status(403).json({ message: 'Permisos insuficientes para esta acción.' });
        }
         // Adjunta los datos del usuario a la petición
        req.user = decoded;
        next();
        
    } catch (error) {
        return res.status(401).json({message: 'Sesión inválida. Acceso denegado.'});
    }
};

exports.isAdmin = exports.protect(1);
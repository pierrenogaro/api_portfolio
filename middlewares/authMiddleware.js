const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: '🔒 Token is missing or invalid. Please provide a valid token.' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: '🔴 Access denied. Invalid token or session expired.' });
        } else {
            req.user = decoded;
            next();
        }
    });
}

module.exports = authMiddleware;
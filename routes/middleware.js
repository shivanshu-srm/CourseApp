// routes/middleware.js
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

// Middleware to authenticate JWT token
function authenticateJWT(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Get token from "Bearer token"

    if (!token) {
        return res.status(403).json({ message: 'Token missing' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
}

module.exports = { authenticateJWT, isAdmin };

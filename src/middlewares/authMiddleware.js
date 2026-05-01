const jwt = require('jsonwebtoken');

// Load kunci yang baru saja Anda download
const serviceAccount = require('../config/serviceAccountKey.json');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Token not found' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ success: false, message: 'Invalid token format' });
    }

    const token = parts[1];

    try {
        const decodedWeb = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedWeb;
        req.authType = 'web'; // Penanda
        return next();
    } catch (e) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access Denies: Invalid token. Please login again.' 
        });
    }
};

module.exports = authMiddleware;
const jwt = require('jsonwebtoken');

const authJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'JWT token tidak ditemukan'
        });
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({
            success: false,
            message: 'Format JWT salah'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // { id, name, email, role }
        req.authType = 'web';

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'JWT tidak valid'
        });
    }
};

module.exports = authJwt;

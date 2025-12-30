const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");

// Init Firebase Admin (sekali saja)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const authFirebase = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Firebase token tidak ditemukan",
        });
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({
            success: false,
            message: "Format Firebase token salah",
        });
    }

    try {
        const decoded = await admin.auth().verifyIdToken(token);

        req.user = {
            firebase_uid: decoded.uid,
            email: decoded.email,
            name: decoded.name || null,
        };

        req.authType = "mobile";

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Firebase token tidak valid",
        });
    }
};

module.exports = authFirebase;

const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

// Load kunci yang baru saja Anda download
const serviceAccount = require('../config/serviceAccountKey.json');

// Inisialisasi Firebase Admin (hanya jika belum aktif)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ success: false, message: 'Format token salah' });
    }

    const token = parts[1];

    // --- SKENARIO 1: Cek User WEB (JWT Lokal) ---
    try {
        const decodedWeb = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedWeb;
        req.authType = 'web'; // Penanda
        return next();
    } catch (e) {
        // Abaikan error web, lanjut cek firebase
    }

    // --- SKENARIO 2: Cek User MOBILE (Firebase) ---
    try {
        const decodedFirebase = await admin.auth().verifyIdToken(token);
        
        // Simpan data user firebase ke req.user
        req.user = {
            uid: decodedFirebase.uid,
            email: decodedFirebase.email,
            // Tambahkan field lain jika perlu
        };
        req.authType = 'mobile'; // Penanda
        return next();
    } catch (e) {
        // Gagal keduanya
        return res.status(401).json({ 
            success: false, 
            message: 'Akses ditolak: Token tidak valid untuk Web maupun Mobile' 
        });
    }
};

module.exports = authMiddleware;
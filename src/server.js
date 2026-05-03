require('dotenv').config();
const connectDB = require('./config/database');
const app = require('./app');

connectDB();
// Letakkan ini setelah semua route Anda
app.use((err, req, res, next) => {
    console.error("Error dari Middleware/Server:", err); // Ini akan muncul di Terminal
    res.status(500).json({
        success: false,
        message: err.message || "Terjadi kesalahan pada server"
    });
});
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
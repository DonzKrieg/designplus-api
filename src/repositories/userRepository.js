const pool = require('../config/database');

class UserRepository {
    static async getUserWhislist(userId) {
        const [rows] = await pool.query(`
            SELECT
                w.id AS wishlist_id,
                p.id AS product_id,
                p.nama,
                p.harga,
                p.file
            FROM wishlists w
            JOIN products p ON p.id = w.product_id
            WHERE w.user_id = ?
        `, [userId]);

        return rows;
    }

    static async createWishlistEntry(userId, productId) {
        const [result] = await pool.query(`
            INSERT INTO wishlists (user_id, product_id)
            VALUES (?, ?)
        `, [userId, productId]);
        return result.insertId;
    }

    static async deleteWishlist(id) {
        await pool.query('DELETE FROM wishlists WHERE id = ?', [id]);
    }

    static async findByEmail(email) {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM users');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE id = ?', [id]
        );
        return rows[0];
    }

    static async findByFirebaseUid(firebaseUid) {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE firebase_uid = ?', [firebaseUid]
        );
        return rows[0];
    }

    // Nambah Bagian buat Update Firebase UID kalo user login pake email.
    static async updateFirebaseUid(id, firebaseUid) {
        await pool.query(
          'UPDATE users SET firebase_uid = ? WHERE id = ?',
          [firebaseUid, id]
        );
    }

    // --- BAGIAN INI DIUPDATE ---
    // Menerima firebase_uid dan phone agar sinkronisasi Mobile berjalan
    static async create({ name, email, password, role, phone, firebase_uid }) {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role, phone, firebase_uid) VALUES (?, ?, ?, ?, ?, ?)',
            [
                name, 
                email, 
                password, 
                role, 
                phone || null,         // Jika kosong, set NULL
                firebase_uid || null   // Jika kosong, set NULL
            ]
        );
        return { id: result.insertId, name, email, role, phone, firebase_uid };
    }
    // ---------------------------

    static async update(id, { name, full_name, phone, location, postal_code }) {
        await pool.query(
            'UPDATE users SET name = ?, full_name = ?, phone = ?, location = ?, postal_code = ? WHERE id = ?',
            [name, full_name, phone, location, postal_code, id]
        );
        return { id, name, full_name, phone, location, postal_code };
    }

    static async updatePassword(id, hashedPassword) {
        const [result] = await pool.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );

        return result.affectedRows; 
    }

    static async updateRole(id, role) {
        // PERBAIKAN BUG: Sebelumnya tertulis 'db.query', diganti jadi 'pool.query'
        const [result] = await pool.query(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, id]
        );

        return result;
    }


    static async delete(id) {
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return true;
    }
}

module.exports = UserRepository;
const pool = require('../config/database');

class UserRepository {
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

    static async create({ name, email, password, role }) {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        );
        return { id: result.insertId, name, email, role };
    }

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
        const [result] = await db.query(
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


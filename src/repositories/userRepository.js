const pool = require('../config/database');

class UserRepository {
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

    static async create({ name, email, password }) {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );
        return { id: result.insertId, name, email };
    }

    static async update(id, { name, email }) {
        await pool.query(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name, email, id]
        );
        return { id, name, email };
    }

    static async delete(id) {
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return true;
    }
}

module.exports = UserRepository;


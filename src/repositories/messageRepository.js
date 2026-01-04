const db = require('../config/database');

const getMessagesByUserId = async (userId) => {
    const query = `SELECT * FROM messages WHERE user_id = ? ORDER BY created_at ASC`;
    const [rows] = await db.query(query, [userId]);
    return rows;
};

const createMessage = async (data) => {
    const { user_id, message, created_at, updated_at } = data;
    const query = `
        INSERT INTO messages 
        (user_id, message, is_admin_reply, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?)
    `;
    // is_admin_reply di-hardcode 0 karena ini dari sisi User
    const [result] = await db.query(query, [user_id, message, 0, created_at, updated_at]);
    return result;
};

module.exports = {
    getMessagesByUserId,
    createMessage
};
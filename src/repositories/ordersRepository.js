const db = require('../config/database');

const getAllOrders = async () => {
    const [rows] = await db.query('SELECT * from orders');
    return rows;
};

const getOrdersByUserId = async (userId) => {
    const [rows] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
}

const getOrderById = async (id) => {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0];
};

const createOrder = async (order) => {
    // 1. Bongkar data
    const { user_id, number, total_price, shipping_address, shipping_cost, payment_status, order_status, snap_token } = order;

    // 2. Query SQL yang BENAR (Ada 8 tanda tanya)
    const [result] = await db.query(
        `INSERT INTO orders (
            user_id, number, total_price, shipping_address, shipping_cost, payment_status, order_status, snap_token
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, // Pastikan ada 8 tanda tanya disini!

        [user_id, number, total_price, shipping_address, shipping_cost, payment_status, order_status, snap_token]
    );
    return result.insertId;
};

const updateOrder = async (id, order) => {
    const { payment_status, order_status, snap_token } = order;
    await db.query(
        'UPDATE orders SET payment_status = ?, order_status = ?, snap_token = ? WHERE id = ?',
        [payment_status, order_status, snap_token, id]
    );
};

const deleteOrder = async (id) => {
    await db.query('DELETE FROM orders WHERE id = ?', [id]);
};

module.exports = {
    getAllOrders,
    getOrdersByUserId,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
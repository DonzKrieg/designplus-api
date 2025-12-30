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

const createOrder = async (orderData) => {
    const connection = await db.getConnection(); 

    try {
        await connection.beginTransaction();

        const { user_id, number, total_price, shipping_address, shipping_cost, payment_status, order_status, snap_token } = orderData;
        
        const [resultOrder] = await connection.query(
            `INSERT INTO orders (
                user_id, number, total_price, shipping_address, shipping_cost, payment_status, order_status, snap_token, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [user_id, number, total_price, shipping_address, shipping_cost, payment_status, order_status, snap_token]
        );

        const newOrderId = resultOrder.insertId; 

        if (orderData.items && orderData.items.length > 0) {
            const itemsValues = orderData.items.map(item => [
                newOrderId,          
                item.product_id,
                item.product_name,
                item.product_price,
                item.bahan || '-',
                item.warna || '-',
                item.quantity,
                item.subtotal,
                item.custom_file || '',
                item.note || '-',
                new Date(),
                new Date()  
            ]);

            const queryItems = `
                INSERT INTO order_items 
                (order_id, product_id, product_name, product_price, bahan, warna, quantity, subtotal, custom_file, note, created_at, updated_at) 
                VALUES ?
            `;

            await connection.query(queryItems, [itemsValues]);
        }

        await connection.commit();
        
        return newOrderId;

    } catch (error) {
        await connection.rollback();
        throw error; 
    } finally {
        connection.release();
    }
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
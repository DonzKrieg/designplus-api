const db = require('../config/database');

const getAllOrders = async () => {
    const [rows] = await db.query('SELECT * from orders');
    return rows;
};

const getOrdersByUserId = async (userId) => {
    // 1. HAPUS GROUP BY agar semua item terambil
    const query = `
        SELECT 
            o.id as order_id, 
            o.user_id, 
            o.number, 
            o.total_price, 
            o.payment_status, 
            o.order_status, 
            o.snap_token,
            o.created_at,
            oi.id as item_id, 
            oi.product_name, 
            oi.custom_file, 
            oi.quantity as item_quantity,
            oi.product_price
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = ? 
        ORDER BY o.created_at DESC
    `;
    
    const [rows] = await db.query(query, [userId]);

    // 2. Logic Grouping menggunakan JavaScript (Mapping)
    const ordersMap = new Map();

    rows.forEach(row => {
        // Jika order belum ada di Map, buat entry baru
        if (!ordersMap.has(row.order_id)) {
            ordersMap.set(row.order_id, {
                id: row.order_id,
                user_id: row.user_id,
                number: row.number,
                total_price: row.total_price,
                payment_status: row.payment_status,
                order_status: row.order_status,
                snap_token: row.snap_token,
                created_at: row.created_at,
                // Kita buat array 'items' untuk menampung banyak produk
                items: [] 
            });
        }

        // Masukkan data produk ke array 'items'
        if (row.item_id) {
            ordersMap.get(row.order_id).items.push({
                product_name: row.product_name,
                custom_file: row.custom_file,
                quantity: row.item_quantity,
                price: row.product_price
            });
        }
    });

    // Ubah Map kembali menjadi Array untuk dikirim ke Flutter
    return Array.from(ordersMap.values());
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
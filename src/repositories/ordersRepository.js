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
    // 1. Ambil koneksi khusus (bukan pool) untuk Transaction
    const connection = await db.getConnection(); 

    try {
        // 2. Mulai Transaksi
        await connection.beginTransaction();

        // 3. Insert ke tabel ORDERS
        const { user_id, number, total_price, shipping_address, shipping_cost, payment_status, order_status, snap_token } = orderData;
        
        const [resultOrder] = await connection.query(
            `INSERT INTO orders (
                user_id, number, total_price, shipping_address, shipping_cost, payment_status, order_status, snap_token, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [user_id, number, total_price, shipping_address, shipping_cost, payment_status, order_status, snap_token]
        );

        const newOrderId = resultOrder.insertId; // ID Order yang baru dibuat

        // 4. Insert ke tabel ORDER_ITEMS (Jika ada items)
        if (orderData.items && orderData.items.length > 0) {
            // Mapping data items menjadi array of arrays sesuai urutan kolom DB
            const itemsValues = orderData.items.map(item => [
                newOrderId,          // order_id (Relasi ke tabel orders)
                item.product_id,
                item.product_name,
                item.product_price,
                item.bahan || '-',
                item.warna || '-',
                item.quantity,
                item.subtotal,
                item.custom_file || '',
                item.note || '-',
                new Date(), // created_at
                new Date()  // updated_at
            ]);

            // Query Bulk Insert
            const queryItems = `
                INSERT INTO order_items 
                (order_id, product_id, product_name, product_price, bahan, warna, quantity, subtotal, custom_file, note, created_at, updated_at) 
                VALUES ?
            `;

            // Eksekusi insert items
            await connection.query(queryItems, [itemsValues]);
        }

        // 5. Commit Transaksi (Simpan Permanen)
        await connection.commit();
        
        return newOrderId;

    } catch (error) {
        // 6. Rollback jika ada error (Batalkan semua perubahan)
        await connection.rollback();
        throw error; // Lempar error agar ditangkap Controller
    } finally {
        // 7. Lepaskan koneksi kembali ke pool
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
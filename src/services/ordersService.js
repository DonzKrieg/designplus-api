const ordersRepository = require('../repositories/ordersRepository');

const getAllOrders = async () => {
    return await ordersRepository.getAllOrders();
};

const getOrderById = async (id) => {
    const order = await ordersRepository.getOrderById(id);
    if (!order) {
        throw new Error(`Order dengan id: ${id} tidak ditemukan`);
    };
    return order;
};

const getOrdersByUserId = async (userId) => {
    const order = await ordersRepository.getOrdersByUserId(userId);
    if (!order) {
        throw new Error(`Order dengan user id: ${userId} tidak ditemukan`);
    };
    return order;
};

const createOrder = async (orderData) => {
    if (!orderData.total_price || !orderData.shipping_address || !orderData.shipping_cost) {
        throw new Error('Semua field harus terisi (Harga, Alamat, Ongkir)');
    }

    if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Data items kosong. Tidak bisa membuat order tanpa produk.');
    }

    return await ordersRepository.createOrder(orderData);
};

const updateOrder = async (id, order) => {
    await getOrderById(id);
    return await ordersRepository.updateOrder(id, order);
};

const deleteOrder = async (id) => {
    await getOrderById(id);
    return await ordersRepository.deleteOrder(id);
};

module.exports = {
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    createOrder,
    updateOrder,
    deleteOrder
};
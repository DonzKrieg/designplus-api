const ordersRepository = require('../repositories/ordersRepository');

const getAllOrders = async () => {
    return await ordersRepository.getAllOrders();
};

const getOrderById = async (id) => {
    const order = await ordersRepository.getOrderById(id);
    if(!order){
        throw new Error(`Order dengan id: ${id} tidak ditemukan`);
    };
    return order;
};

const getOrdersByUserId = async (userId) => {
    const order = await ordersRepository.getOrdersByUserId(userId);
    if(!order){
        throw new Error(`Order dengan user id: ${userId} tidak ditemukan`);
    };
    return order;
};

const createOrder = async (order) => {
    if(!order.total_price || !order.shipping_address || !order.shipping_cost){
        throw new Error('Semua field harus terisi');
    }
    return await ordersRepository.createOrder(order);
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
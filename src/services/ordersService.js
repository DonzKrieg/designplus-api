const ordersRepository = require('../repositories/ordersRepository');

class OrdersService {
    static async createOrder(orderData) {
        if (!orderData.total_price || !orderData.shipping_address || !orderData.shipping_cost) {
            throw new Error('Semua field harus terisi (Harga, Alamat, Ongkir)');
        }
        if (!orderData.items || orderData.items.length === 0) {
            throw new Error('Data items kosong. Tidak bisa membuat order tanpa produk.');
        }
        return await ordersRepository.createOrder(orderData);
    }

    static async getAllOrders() {
        return await ordersRepository.getAllOrders();
    }

    static async getOrderById(id) {
        const order = await ordersRepository.getOrderById(id);
        if (!order) {
            throw new Error(`Order dengan id: ${id} tidak ditemukan`);
        }
        return order;
    }

    static async getOrdersByUserId(userId) {
        const order = await ordersRepository.getOrdersByUserId(userId);
        if (!order) {
            throw new Error(`Order dengan user id: ${userId} tidak ditemukan`);
        }
        return order;
    }

    static async updateOrder(id, orderData) {
        await this.getOrderById(id);
        return await ordersRepository.updateOrder(id, orderData);
    }

    static async deleteOrder(id) {
        await this.getOrderById(id);
        return await ordersRepository.deleteOrder(id);
    }
}

module.exports = OrdersService;
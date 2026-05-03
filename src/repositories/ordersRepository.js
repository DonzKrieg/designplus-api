const Order = require('../models/Order');

class OrderRepository {
    static async createOrder(orderData) {
        const newOrder = new Order(orderData);
        return await newOrder.save();
    }

    static async getAllOrders() {
        const orders = await Order.find().populate('user').populate('products');
        return orders;
    }

    static async getOrdersByUserId(userId) {
        const orders = await Order.find({ user: userId }).populate('products');
        return orders;
    }

    static async getOrderById(id) {
        const order = await Order.findById(id).populate('user').populate('products');
        return order;
    }

    static async updateOrder(id, orderData) {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            orderData,
            { new: true }
        );
        return updatedOrder;
    }

    static async deleteOrder(id) {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            throw new Error('Order tidak ditemukan');
        }
        return deletedOrder;
    }
}

module.exports = OrderRepository;
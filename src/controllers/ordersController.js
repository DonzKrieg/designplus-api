const ordersService = require('../services/ordersService');
const userRepository = require('../repositories/userRepository');

class OrdersController {
    static async getAllOrders(req, res) {
        try {
            const order = await ordersService.getAllOrders();
            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getOrderById(req, res) {
        try {
            const order = await ordersService.getOrderById(req.params.id);
            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getOrdersByUserId(req, res) {
        try {
            const order = await ordersService.getOrdersByUserId(req.params.userId);
            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async createOrder(req, res) {
        try {
            const order = await ordersService.createOrder({
                user_id: req.body.user.id,
                invoice_number: req.body.number ?? `INV-${Date.now()}-${req.body.user.id}`,
                total_price: req.body.total_price,
                shipping_address: req.body.shipping_address ?? null,
                shipping_cost: req.body.shipping_cost ?? 0,
                payment_status: "pending",
                order_status: "processing",
                snap_token: req.body.snap_token ?? "",
                products: req.body.products || []
            });
            res.status(201).json({
                success: true,
                message: 'Berhasil membuat pesanan',
                data: { order: order }
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async updateOrder(req, res) {
        try {
            const orderId = req.params.id;
            const order = await ordersService.updateOrder(orderId, {
                payment_status: req.body.payment_status,
                order_status: req.body.order_status,
            });
            res.status(200).json({
                success: true,
                message: `Berhasil memperbarui pesanan dengan id: ${orderId}`,
                data: order
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async deleteOrder(req, res) {
        try {
            await ordersService.deleteOrder(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Pesanan berhasil dihapus'
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = OrdersController;
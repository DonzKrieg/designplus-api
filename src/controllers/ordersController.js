const ordersService = require('../services/ordersService');
const userRepository = require('../repositories/userRepository');


const getAllOrders = async (req, res) => {
    try {
        const order = await ordersService.getAllOrders();
        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
};

const getOrderById = async (req, res) => {
    try {
        const order = await ordersService.getOrderById(req.params.id);
        if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Akses ditolak'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

const getOrdersByUserId = async (req, res) => {
    try {
        const orders = await ordersService.getOrdersByUserId(req.user.id);
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

const createOrder = async (req, res) => {
    try {
        console.log("=== DATA DARI FLUTTER ===");
        console.log(req.body);

        const userEmail = req.body.email;

        if (!userEmail) {
            return res.status(400).json({
                success: false,
                message: "Email user wajib dikirim untuk sinkronisasi ID."
            });
        }

        const userMysql = await userRepository.findByEmail(userEmail);

        if (!userMysql) {
            return res.status(404).json({
                success: false,
                message: `User dengan email ${userEmail} tidak ditemukan di Database MySQL.`
            });
        }

        const realUserId = userMysql.id;

        console.log(`User ditemukan! Email: ${userEmail} -> ID MySQL: ${realUserId}`);

        const order = await ordersService.createOrder({
            user_id: realUserId, 
            number: req.body.number ?? `INV-${Date.now()}-${realUserId}`,
            total_price: req.body.total_price,
            shipping_address: req.body.shipping_address ?? null,
            shipping_cost: req.body.shipping_cost ?? 0,
            payment_status: req.body.payment_status,
            order_status: req.body.order_status,
            snap_token: req.body.snap_token ?? ""
        });

        res.status(201).json({
            success: true,
            message: "Order berhasil disimpan dengan ID User yang benar.",
            data: { orders: order }
        });

    } catch (error) {
        console.error("ERROR CREATE ORDER:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
};

const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await ordersService.updateOrder(orderId, {
            payment_status: req.body.payment_status,
            order_status: req.body.order_status,
            snap_token: req.body.snap_token
        });

        res.status(201).json({
            success: true,
            message: 'Berhasil membuat pesanan',
            data: { order: order }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
};

const deleteOrder = async (req, res) => {
    try {
        await ordersService.deleteOrder(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Pesanan berhasil dihapus'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    };
};

module.exports = {
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    createOrder,
    updateOrder,
    deleteOrder
};
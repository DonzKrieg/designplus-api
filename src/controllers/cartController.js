const CartService = require('../services/cartService');
const UserService = require('../services/userService');

class CartController {

    static async index(req, res) {
        try {
            const userId = req.user.uid;
            const user = await UserService.getUserByFirebaseUid(userId);

            const cart = await CartService.getUserCart(user.id);

            res.json({
                success: true,
                data: cart
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    static async store(req, res) {
        try {
            const userId = req.user.uid;
            const user = await UserService.getUserByFirebaseUid(userId);
            console.log('REQ USER:', req.user);
            console.log('REQ BODY:', req.body);

            const cartId = await CartService.addToCart(user.id, req.body);

            res.status(201).json({
                success: true,
                message: 'Item berhasil ditambahkan ke cart',
                cart_id: cartId
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    static async update(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            await CartService.updateCartItem(userId, id, req.body);

            res.json({
                success: true,
                message: 'Item cart berhasil diperbarui'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    static async destroy(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            await CartService.removeCartItem(userId, id);

            res.json({
                success: true,
                message: 'Item cart berhasil dihapus'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    // Dipanggil saat checkout
    static async clearAfterCheckout(req, res) {
        try {
            const userId = req.user.id;

            await CartService.clearSelectedItems(userId);

            res.json({
                success: true,
                message: 'Cart berhasil dikosongkan'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }
}

module.exports = CartController;

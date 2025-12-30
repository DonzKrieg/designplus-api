const CartRepository = require('../repositories/cartRepository');

class CartService {
    static async getUserCart(userId) {
        return await CartRepository.getByUserId(userId);
    }

    static async addToCart(userId, payload) {
        return await CartRepository.create({
            user_id: userId,
            product_id: payload.product_id,
            quantity: payload.quantity || 1,
            material: payload.material,
            warna: payload.warna,
            note: payload.note,
            custom_file: payload.custom_file,
            is_selected: 1
        });
    }

    static async updateCartItem(userId, cartId, payload) {
        await CartRepository.update(cartId, payload);
    }

    static async removeCartItem(userId, cartId) {
        await CartRepository.deleteById(cartId);
    }

    static async clearSelectedItems(userId) {
        await CartRepository.deleteSelectedByUser(userId);
    }
}

module.exports = CartService;

const Cart = require('../models/Cart');

class CartRepository {
  static async create(data) {
    const cartItem = new Cart(data);
    return await cartItem.save();
  }

  static async getByUserId(userId) {
    const cartItems = await Cart.find({ user_id: userId }).populate('product_id');
    return cartItems;
  }

  static async findByUserAndProduct(userId, productId) {
    const cartItem = await Cart.findOne({ user_id: userId, product_id: productId });
    return cartItem;
  }

  static async update(id, data) {
    const updatedCartItem = await Cart.findByIdAndUpdate(id, data, { new: true });
    return updatedCartItem;
  }

  static async deleteById(id) {
    const deletedCartItem = await Cart.findByIdAndDelete(id);
    if(!deletedCartItem) {
      throw new Error('Item tidak ditemukan di keranjang');
    }
    return deletedCartItem;
  }

  static async deleteSelectedByUser(userId) {
    const deleteSelectedItems = await Cart.deleteMany({ user_id: userId, selected: true });
    return deleteSelectedItems;
  }
}

module.exports = CartRepository;
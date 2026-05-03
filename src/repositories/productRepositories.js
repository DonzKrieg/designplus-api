const Product = require('../models/Product');

class ProductRepository {
    static async create(productData) {
        const newProduct = new Product(productData);
        return await newProduct.save();
    }

    static async getAllProducts() {
        const products = await Product.find();
        return products;
    }

    static async getProductById(id) {
        const product = await Product.findById(id);
        return product;
    }

    static async update(id, productData) {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            productData,
            { new: true }
        );
        return updatedProduct;
    }

    static async deleteProduct(id) {
        const deleteProduct = await Product.findByIdAndDelete(id);
        if (!deleteProduct) {
            throw new Error('Product tidak ditemukan');
        }
        return deleteProduct;
    }
}

module.exports = ProductRepository;
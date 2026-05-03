const productService = require('../services/productServices');

class ProductControllers {
    static async createProduct(req, res) {
        try {
            if(!req.file) {
                return res.status(400).json({ success: false, message: 'Product image is required' });
            }
            const imageUrl = req.file.path;
            const productData = {
                ...req.body,
                product_image: imageUrl
            }
            const newProduct = await productService.createProduct(productData);
            
            res.status(200).json({
                success: true,
                message: 'Product Created',
                data: newProduct
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        };
    }

    static async getAllProducts(req, res) {
        try {
            const products = await productService.getAllProducts();
            res.status(200).json({
                success: true,
                data: products
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        };
    }

    static async getProductById(req, res) {
        try {
            const product = await productService.getProductById(req.params.id);
            res.status(200).json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        };
    }

    static async updateProduct(req, res) {
        try {
            const product = await productService.updateProduct(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Product Updated',
                data: product
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message});
        }
    }

    static async deleteProduct(req, res) {
        try {
            await productService.deleteProduct(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Product Deleted'
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = ProductControllers;
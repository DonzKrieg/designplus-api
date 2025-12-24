const productService = require('../services/productServices');

const getAllProducts = async (req, res) => {
    try {
        const product = await productService.getAllProducts();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
};

const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    };
};

const createProduct = async (req, res) => {
    try {
        const id = await productService.createProduct(req.body);
        res.status(200).json({ message: 'Product Created', id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    };
};

const updateProduct = async (req, res) => {
    try {
        await productService.updateProduct(req.params.id, req.body);
        res.json({ message: 'Product Updated' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    };
};

const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(200).json({ message: 'Product Deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    };
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
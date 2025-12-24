const productRepository = require('../repositories/productRepositories');

const getAllProducts = async () => {
    return await productRepository.getAllProducts();
};

const getProductById = async (id) => {
    const product = await productRepository.getProductById(id);
    if(!product){
        throw new Error('Product tidak ditemukan');
    }
    return product;
};

const createProduct = async (product) => {
    if(!product.nama || !product.harga || !product.kategori || !product.file || !product.rating ){
        throw new Error('Semua data harus terisi');
    }
    return await productRepository.createProduct(product);
};

const updateProduct = async (id, product) => {
    await getProductById(id);
    return await productRepository.updateProduct(id, product);
};

const deleteProduct = async (id) => {
    await getProductById(id);
    return await productRepository.deleteProduct(id);
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
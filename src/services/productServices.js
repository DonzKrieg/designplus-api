const productRepository = require('../repositories/productRepositories');

class ProductService {
    static async createProduct(productData) {
        if(!productData.name || !productData.price || !productData.category || !productData.product_image || !productData.rating ){
            throw new Error('Semua data harus terisi');
        }
        return await productRepository.create(productData);
    }

    static async getAllProducts() {
        return await productRepository.getAllProducts();
    }

    static async getProductById(id) {
        const product = await productRepository.getProductById(id);
        if(!product){
            throw new Error(`Product dengan id ${id} tidak ditemukan`);
        }
        return product;
    }

    static async updateProduct(id, productData) {
        await this.getProductById(id);
        return await productRepository.update(id, productData);
    }

    static async deleteProduct(id) {
        await this.getProductById(id);
        return await productRepository.deleteProduct(id);
    }
}

module.exports = ProductService;
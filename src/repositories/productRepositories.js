const db = require('../config/database');

const getAllProducts = async () => {
    const [rows] = await db.query('SELECT * FROM products');
    return rows;
};

const getProductById = async (id) => {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
};

const createProduct = async (product) => {
    const { nama, harga, kategori, file, rating } = product;
    const [result] = await db.query(
        'INSERT INTO products (nama, harga, kategori, file, rating) VALUES (?, ?, ?, ?, ?)',
        [nama, harga, kategori, file, rating]
    );
    return result.insertId;
};

const updateProduct = async (id, product) => {
    const { nama, harga, kategori, file, rating } = product;
    await db.query(
        'UPDATE products SET nama = ?, harga = ?, kategori = ?, file = ?, rating = ? WHERE id = ?',
        [nama, harga, kategori, file, rating, id]
    );
};

const deleteProduct = async (id) => {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
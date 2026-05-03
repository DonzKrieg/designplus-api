const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        material: [
            {
                type: String,
            }
        ],
        color: [
            {
                type: String,
            }
        ],
        stock: {
            type: Number,
        },
        sold: {
            type: Number,
            default: 0,
        },
        product_image: {
            type: String,
        },
        rating: {
            type: Number,
            default: 0,
        },
    }, 
    {timestamps: true}
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
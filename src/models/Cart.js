const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            }
        ],
        custom_file: {
            type: String,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        note: {
            type: String,
        },
        is_selected: {
            type: Boolean,
            default: false,
        }
    }, 
    {timestamps: true}
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
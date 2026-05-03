const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        invoice_number: {
            type: String,
            unique: true,
            required: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            }
        ],
        total_price: {
            type: Number,
            required: true,
        },
        payment_status: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        order_status: {
            type: String,
            enum: ["processing", "shipped", "delivered", "cancelled"],
            default: "processing",
        },
        shipping_address: {
            type: String,
            required: true,
        },
        snap_token: {       // Kolom untuk menyimpan snap_token dari Xendit
            type: String,
        }
    }, 
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
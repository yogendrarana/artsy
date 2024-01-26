import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.ObjectId, ref: "Order", required: true },
    artId: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
}, {
    timestamps: true
});

export const OrderItem = mongoose.model('OrderItem', schema);
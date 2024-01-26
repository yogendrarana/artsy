import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    orderSubtotal: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    orderTotal: { type: Number, required: true, default: 0 },
    orderStatus: { type: String, required: true, default: "processing" },
    shippedOn: { type: Date },
    deliveredOn: { type: Date },
    shippingDetail: {
        name: { type: String, required: true },
        phone: { type: Number, required: true },
        email: { type: String },
        city: { type: String, required: true },
        province: { type: String, required: true },
        address: { type: String, required: true },
    },
    paymentDetail: {
        id: { type: String, required: true },
        status: { type: String, required: true }
    },
}, {
    timestamps: true
})


//exporting module
export const Order = mongoose.model('Order', orderSchema);
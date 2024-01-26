import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: { type: String, required: [true, "Please, enter the name!"] },
    price: { type: Number, required: [true, "Please, enter the price!"] },
    description: { type: String, required: [true, "Please, enter the description!"] },
    category: { type: String, required: [true, "Please, enter the product category!"] },
    images: [{
        public_id: { type: String, required: true },
        url: { type: String, required: true },
    }],
    creatorId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    discount: { type: Number, default: null },
    isAuctionItem: { type: Boolean, default: false },
    estimatedValueFrom: { type: Number },
    estimatedValueTo: { type: Number },
    auctionEndDate: { type: String },
    artStatus: { type: String, default: "unsold" }
}, {
    timestamps: true
});

export const Art = mongoose.model("Art", schema);

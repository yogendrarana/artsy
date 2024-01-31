import mongoose from "mongoose";

const schema = new mongoose.Schema({
    artId: { type: mongoose.Schema.ObjectId, ref: 'Art', required: true },
    reviewerId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
}, {
    timestamps: true
});

export const Review = mongoose.model("Review", schema);
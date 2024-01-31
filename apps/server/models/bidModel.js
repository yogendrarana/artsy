import mongoose from 'mongoose'

const schema = new mongoose.Schema({
	artId: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Art', 
        required: true
    },

    bidderId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

    bidAmount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

export const Bid = mongoose.model("Bid", schema);
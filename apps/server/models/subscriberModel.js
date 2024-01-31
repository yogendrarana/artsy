import mongoose from 'mongoose';
import validator from 'validator';

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please, enter the email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please, enter a valid email."],
    }
}, {
    timestamps: true
})

// exporting model
export const Subscriber = mongoose.model('Subscriber', subscriberSchema);
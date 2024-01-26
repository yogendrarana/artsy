import crypto from 'crypto';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";


const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please enter your name!'] 
    },
    email: { 
        type: String, 
        required: [true, 'Please enter your email!'], 
        validate: validator.isEmail 
    },
    password: { 
        type: String, 
        required: [true, 'Please enter the password!'], 
        minLength: [6, "Password should be at least six characters long!"], 
        select: false 
    },
    avatar: { 
        public_id: { type: String }, 
        url: { type: String } 
    },
    role: { 
        type: String, 
        default: 'user' 
    },
    socials: { 
        facebook: { type: String, default: "" }, 
        instagram: { type: String, default: "" }, 
        twitter: { type: String, default: "" },
    },
    donation: {
        khalti: {
            public_key: { type: String, default: '' },
            secret_key: { type: String, default: '' }
        }
    },
    passwordResetToken: { type: String },
    passwordResetExpire: { type: Date },

}, {
    timestamps: true
})


// hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next();
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})


//compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


// create access token
userSchema.methods.createAccessToken = function (expiresIn='1d') {
    return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn });
}


//create reset password token
userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpire = Date.now() + 5 * 60 * 1000;
    return resetToken;
}


export const User = mongoose.model('User', userSchema);
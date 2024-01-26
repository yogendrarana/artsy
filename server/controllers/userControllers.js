import cloudinary from "cloudinary"
import { Art } from '../models/artModel.js';
import { User } from '../models/userModel.js'
import sendEmail from '../util/sendEmail.js';
import { Chat } from '../models/chatModel.js';
import ErrorHandler from '../util/errorHandler.js'
import { Message } from '../models/messageModel.js';
import catchAsyncError from '../util/catchAsyncError.js'

// get my profile
export const getMyProfileData = catchAsyncError(async (req, res, next) => {
    const user = await User.findById({ _id: req.user.id });

    res.status(200).json({
        success: true,
        user
    });
});


// get user profile
export const getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById({ _id: req.params.id })

    res.status(200).json({
        success: true,
        user
    });
});


// update profile
export const updateProfile = catchAsyncError(async (req, res, next) => {
    const { name, email, facebook, instagram, twitter, khaltiPublicKey, khaltiSecretKey } = req.body
    if (!name || !email) return next(new ErrorHandler("Name and email cannot be empty!", 400));
    const user = await User.findById(req.user.id);

    user.name = name;
    user.email = email;
    user.socials.facebook = facebook;
    user.socials.instagram = instagram;
    user.socials.twitter = twitter;
    user.donation.khalti.public_key = khaltiPublicKey;
    user.donation.khalti.secret_key = khaltiSecretKey;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user
    });
});


// update avatar
export const updateAvatar = catchAsyncError(async (req, res, next) => {
    const { avatar } = req.body
    const user = await User.findById(req.user.id);

    if (!user.avatar.public_id && !user.avatar.url) {
        const { public_id, secure_url } = await cloudinary.v2.uploader.upload(avatar, { folder: 'ArtGallery/Avatars' });
        user.avatar.public_id = public_id;
        user.avatar.url = secure_url;
    } else {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        const { public_id, secure_url } = await cloudinary.v2.uploader.upload(avatar, { folder: 'ArtGallery/Avatars' });
        user.avatar.public_id = public_id;
        user.avatar.url = secure_url;
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Profile picture updated successfully',
        user
    });
});


// delete account
export const deleteAccount = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    const arts = await Art.find({ creator: req.params.id })
    const chats = await Chat.find({ participants: req.params.id })

    // delete avatar
    if (user.avatar.public_id && user.avatar.url) { await cloudinary.v2.uploader.destroy(user.avatar.public_id); }

    // delete arts and associated images
    arts.forEach(async (art) => {
        for (let i = 0; i < art.images.length; i++) {
            await cloudinary.v2.uploader.destroy(art.images[i].public_id)
        }
        await art.deleteOne();
    })


    // delete chat and message
    chats.forEach(async (chat) => {
        await Chat.findOneAndDelete({ _id: chat._id })
        await Message.deleteMany({ chatId: chat._id })
    })

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Account deleted successfully.',
        user: {}
    });
});


// send mail from contact
export const sendMailFromContact = catchAsyncError(async (req, res, next) => {
    const { name, email, subject, message } = req.body;
    sendEmail({ sender: email, receiver: process.env.EMAIL_ADDRESS, name, subject, message });

    res.status(200).json({
        success: true,
        message: `Email sent.`
    })
});
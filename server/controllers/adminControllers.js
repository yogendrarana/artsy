import cloudinary from 'cloudinary'
import { Art } from "../models/artModel.js";
import { User } from "../models/userModel.js";
import { Order } from "../models/orderModel.js";
import { OrderItem } from "../models/orderItemModel.js";
import catchAsyncError from "../util/catchAsyncError.js";
import UserApiFeatures from "../util/userApiFeatures.js";


// get stats
export const getStats = catchAsyncError(async (req, res, next) => {
    const totalUsers = await User.count();
    const totalArtworks = await Art.count();
    const totalOrders = await Order.count();
    const totalCreators = await User.count({ role: "creator" });

    const totalSaleResult = await Order.aggregate([
        { $group: { _id: null, totalSale: { $sum: "$orderTotal" } } }
    ]);

    const newUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const newOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    const salesByCategory = await OrderItem.aggregate([
        { $lookup: { from: "arts", localField: "artId", foreignField: "_id", as: "art" } },
        { $unwind: "$art" },
        { $group: { _id: "$art.category", totalSales: { $sum: "$art.price" } } },
        { $sort: { totalSales: -1 } }
    ]);


    const topSellerResult = await OrderItem.aggregate([
        { $lookup: { from: "arts", localField: "artId", foreignField: "_id", as: "art" } },
        { $unwind: "$art" },
        { $lookup: { from: "users", localField: "art.creatorId", foreignField: "_id", as: "creator" } },
        { $unwind: "$creator" },
        { $group: { _id: "$art.creatorId", totalSales: { $sum: "$art.price" }, creatorName: {$first: "$creator.name" }} },
        { $sort: { totalSales: -1 } },
        { $limit: 5 }
    ])

    res.status(200).json({
        totalUsers,
        totalArtworks,
        totalOrders,
        totalCreators,
        totalSale: totalSaleResult.length > 0 ? totalSaleResult[0].totalSale : 0,
        newUsers,
        newOrders,
        salesByCategory,
        topSellers: topSellerResult
    });
})


// get all users
export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const features = new UserApiFeatures(User.find(), req.query).search();
    const users = await features.query;

    res.status(200).json({
        success: true,
        message: "Users fetched successfully!",
        users
    });
});


// delete account
export const deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    const arts = await Art.find({ creatorId: req.params.id })

    // delete arts and associated images
    arts.forEach(async (art) => {
        for (let i = 0; i < art.images.length; i++) {
            await cloudinary.v2.uploader.destroy(art.images[i].public_id)
        }
        await art.deleteOne();
    })

    // delete avatar
    if (user.avatar.public_id && user.avatar.url) { await cloudinary.v2.uploader.destroy(user.avatar.public_id); }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Account deleted successfully.',
    });
});
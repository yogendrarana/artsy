import cloudinary from 'cloudinary'
import { Art } from "../models/artModel.js";
import { Bid } from '../models/bidModel.js';
import { User } from "../models/userModel.js";
import { Review } from '../models/reviewModel.js';
import ErrorHandler from "../util/errorHandler.js";
import ArtApiFeatures from "../util/artApiFeatures.js";
import catchAsyncError from "../util/catchAsyncError.js";


// create art
export const createArt = catchAsyncError(async (req, res, next) => {
    const { name, price, description, category, estimatedValueFrom, estimatedValueTo, endDate, isAuctionItem } = req.body;
    if (!name || !price || !description || !category) return next(new ErrorHandler("Please enter all the required fields.", 400));
    if (isAuctionItem === true && (!estimatedValueFrom || !estimatedValueTo || !endDate)) { return next(new ErrorHandler("Please enter all the required fields for auction item.", 400)) }
    if (price === 0) return next(new ErrorHandler("Price cannot be zero!.", 400));

    req.body.creatorId = req.user.id;
    let artImages = req.files;
    let artImagesLinks = [];

    if (artImages[0]) {
        for (const image of artImages) {
            try {
                const extname = image.originalname.split(".")[1];
                const img = `data:image/${extname};base64,${image.buffer.toString("base64")}`;
                const result = await cloudinary.v2.uploader.upload(img, { folder: 'ArtGallery/Arts' });

                artImagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            } catch (error) {
                return next(new ErrorHandler(error.message, 500));
            }
        }

        req.body.images = artImagesLinks;
    }

    const art = await Art.create(req.body);

    res.status(201).json({
        success: true,
        message: "Artwork uploaded successfully!",
        art
    });
});


// read all products
export const readArts = catchAsyncError(async (req, res, next) => {
    const features = new ArtApiFeatures(Art.find(), req.query).search().sort().filterByPrice();
    const arts = await features.query;

    res.status(200).json({
        success: true,
        message: "Arts fetched successfully!",
        arts
    });
});


// read specific product
export const readArt = catchAsyncError(async (req, res, next) => {
    const artwork = await Art.findById(req.params.id);
    if (!artwork) return next(new ErrorHandler('Art not found!', 404));
    
    res.status(200).json({
        success: true,
        message: "Art fetched successfully!",
        artwork
    });
});


// recommended arts
export const getRecommendations = catchAsyncError(async (req, res, next) => {
    const newArrivals = await Art.find().sort({ createdAt: -1 });
    const specialOffers = await Art.find().sort({ discount: -1 });

    // highest rated
    const highestRated = await Review.aggregate([
        { $group: { _id: "$artId", avgRating: { $avg: "$rating" } } },
        { $sort: { avgRating: -1 } },
        { $limit: 8 },
        { $lookup: { from: "arts", localField: "_id", foreignField: "_id", as: "art" } },
        { $unwind: "$art" },
        { $project: { art: 1, avgRating: 1 } }
    ])

    res.status(200).json({
        success: true,
        newArrivals,
        highestRated,
        specialOffers,
        message: 'Arts fetched successfully'
    })
});


// update art
export const updateArt = catchAsyncError(async (req, res, next) => {

    let art = await Art.findById(req.params.id)
    if (!art) return next(new ErrorHandler('Artwork not found.', 404))
    req.body.creator = req.user.id;
    art = await Art.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });

    res.status(200).json({
        success: true,
        art,
    });
});


// delete art
export const deleteArt = catchAsyncError(async (req, res, next) => {
    const art = await Art.findById(req.params.id);
    if (!art) return next(new ErrorHandler('Artwork not found!', 404));

    // image delete logic
    for (let i = 0; i < art.images.length; i++) {
        await cloudinary.v2.uploader.destroy(art.images[i].public_id);
    }

    await art.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Artwork deleted successfully!',
        art
    });
});


// create review
export const createReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, id } = req.body;

    const reviewExists = await Review.findOne({ reviewerId: req?.user._id, artId: id });

    if (reviewExists) {
        reviewExists.rating = rating;
        reviewExists.comment = comment;
        await reviewExists.save();
    } else {
        await Review.create({ reviewerId: req?.user._id, artId: id, rating, comment });
    }

    res.status(200).json({
        success: true,
        message: "Review sent successfully!"
    })
});



//get reviews
export const getReviews = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const reviews = await Review.find({ artId: id }).sort({ updatedAt: -1 }).populate('reviewerId', 'name');

    res.status(200).json({
        success: true,
        message: "Reviews retrieved successfully.",
        reviews,
    })
});


// delete review
export const deleteReview = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Review deleted successfully!"
    })
});


// get my products
export const getUserArtworks = catchAsyncError(async (req, res, next) => {
    const userArtworks = await Art.find({ creator: req.params.id });

    res.status(200).json({
        success: true,
        message: "Read all my products!",
        userArtworks
    })
})


// add to likes
export const addToLikes = catchAsyncError(async (req, res, next) => {
    const { artId, artName, artPrice, artCategory, artImage } = req.body;
    const user = await User.findById(req.user.id);
    const isLiked = user.likes.find(like => like.artId.toString() === artId.toString());
    if (isLiked) return next(new ErrorHandler("Already liked!", 409));

    user.likes.push({ artId, artName, artPrice, artCategory, artImage });
    await user.save();

    res.status(201).json({
        success: true,
        message: 'Art added to likes.',
        user
    });
});


// remove from likes
export const removeFromLikes = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const art = await Art.findById(req.body.artId);
    if (!art) return next(new ErrorHandler("Artwork not found!", 404));
    const newLikes = user.likes.filter(like => like.artId.toString() !== req.body.artId.toString());
    user.likes = newLikes;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Art removed from likes.',
        user
    });
});


// place bid
export const placeBid = catchAsyncError(async (req, res, next) => {
    const { bidAmount, artId, bidderId } = req.body;

    const art = await Art.findById(artId);
    if (!bidAmount || isNaN(bidAmount)) return next(new ErrorHandler(`Please provide bidding amount.`, 400));
    if (bidderId === art.creatorId.toString()) return next(new ErrorHandler(`You cannot bid on your own auction.`, 400));
    if (bidAmount <= art.estimatedValueFrom) return next(new ErrorHandler(`The bidding price should be bigger than the lower estimated value of Rs ${art.estimatedValueFrom}`, 400));

    // highest bid
    const bids = await Bid.find({ artId }).sort({ bidAmount: -1 });

    if (bids.length === 0) {
        await Bid.create({ artId, bidderId, bidAmount });
        return res.status(201).json({
            success: true,
            message: 'Bid placed successfully.',
        });
    }

    // check if bid is higher than highest bid
    const highestBid = bids[0];
    if (bidAmount <= highestBid.bidAmount) return next(new ErrorHandler(`The bidding price should be bigger than the highest bid of Rs ${highestBid.bidAmount}`, 400));


    // check if bidder has already placed bid
    const hasPlacedBid = await Bid.findOne({ artId, bidderId });
    if (hasPlacedBid) {
        hasPlacedBid.bidAmount = bidAmount;
        await hasPlacedBid.save()
    } else {
        await Bid.create({ artId, bidderId, bidAmount })
    }

    res.status(201).json({
        success: true,
        message: 'Bid placed successfully.',
        art
    });
});


// find highest bid
export const findHighestBid = catchAsyncError(async (req, res, next) => {
    const { artId } = req.query;
    const art = Art.findById(artId);

    if (!art) return next(new ErrorHandler("Artwork not found."));

    const bids = await Bid.find({ artId }).sort({ bidAmount: -1 });

    if (bids.length === 0) {
        return res.status(200).json({
            success: true,
            message: "Retrieved highest bid successfully",
            highestBid: null
        });
    }

    const highestBid = bids[0];

    return res.status(200).json({
        success: true,
        message: "Retrieved highest bid successfully",
        highestBid,
        bids
    });
});
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import ErrorHandler from '../util/errorHandler.js';
import catchAsyncError from '../util/catchAsyncError.js';


export const verifyAccessToken = catchAsyncError((req, res, next) => {
    const accessToken = req.cookies.jwt;
    if (!accessToken || accessToken === undefined) {
        return next(new ErrorHandler("Token not found", 401));
    } 

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return next(new ErrorHandler("Invalid access token", 403));
        req.user = await User.findById(decoded._id);
        next();
    })
})


//middleware to authenticate creator
const creatorRoles = ["admin", "editor", "creator"]

export const isCreator = (req, res, next) => {
    if (!creatorRoles.includes(req.user.role)) {
        return next(new ErrorHandler(`${req.user.role} cannot access this resource.`, 403));
    }
    next();
}


//middleware to check the role of user
export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return next(new ErrorHandler("Only admin can access this resource!", 403))
    }
    next();
}


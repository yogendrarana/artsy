import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import ErrorHandler from "../util/errorHandler.js"
import catchAsyncError from "../util/catchAsyncError.js";
import sendEmailFromSite from "../util/sendEmailFromSite.js";


// register controller
export const handleRegister = catchAsyncError(async (req, res, next) => {
    const { name, email, password, confirmPassword, isCreator } = req.body;
    const normalizedRole = isCreator ? 'creator' : 'user';
    if (password !== confirmPassword) return next(new ErrorHandler('Password do not match.', 400));
    if (name === '' || email === '' || password === '' || confirmPassword === '') {
        return next(new ErrorHandler('The fields cannot be empty', 409));
    }

    const isEmailUsed = await User.findOne({ email });
    if (isEmailUsed) return next(new ErrorHandler("Email is already used!", 400));

    const user = await User.create({ name, email, password, role: normalizedRole });

    // create tokens
    const jwt = user.createAccessToken();

    // set SameSite attribute to "none" for HTTPS, "lax" for HTTP
    const sameSite = req.secure ? 'none' : 'lax';
    res.cookie('jwt', jwt, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: sameSite,
        secure: req.secure,
        domain: 'localhost'
    });

    res.status(201).json({
        success: true,
        message: 'Registered successfully!',
        user
    });
});


// login controller
export const handleLogin = catchAsyncError(async (req, res, next) => {
    const { email, password, remember } = req.body
    if (!email || !password) return next(new ErrorHandler('The fields cannot be empty!', 409));
    const user = await User.findOne({ email }).select('+password').select('+confirmPassword');
    if (!user) return next(new ErrorHandler("Invalid email or password!", 400));
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) return next(new ErrorHandler("Invalid email or password!", 400));
    
    // create tokens
    const jwt = user.createAccessToken();

    res.cookie('jwt', jwt, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        message: 'Logged in successfully!',
        user
    })
});


// logout controller
export const handleLogout = catchAsyncError(async (req, res, next) => {
    const { jwt } = req.cookies;
    if (!jwt) return res.status(204).json({ message: 'No token found!' });
    
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).json({
        success: true,
        message: 'Logged out successfully!'
    })
})


// refresh token controller
export const handleRenewAccessToken = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return next(new ErrorHandler("No token found!", 401));
    const user = await User.findOne({ refreshTokens: cookies.refreshToken });
    if (!user) return next(new ErrorHandler('User does not exist!', 403));

    jwt.verify(cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || decoded._id !== user._id) return next(new ErrorHandler('Invalid token!', 403));
        const accessToken = jwt.sign({ _id: decoded._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
        res.status(200).json({
            success: true,
            accessToken
        });
    });
}


// update password
export const updatePassword = catchAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return next(new ErrorHandler("Please, enter all the fields!", 400));
    const user = await User.findById(req.user.id).select('+password').select('+confirmPassword');
    const passwordMatch = await user.comparePassword(oldPassword);
    if (!passwordMatch) return next(new ErrorHandler('Old password is incorrect.', 400))

    user.password = newPassword;
    user.confirmPassword = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password updated successfully!',
    });
});


// forget password
export const forgetPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new ErrorHandler('User not found!', 404));
    const token = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // const passwordResetUrl = `${req.protocol}://${req.get('host')}/password/reset/${token}`;

    const message =
        `<div style="height: 100px; background-color: #f0f0f0; font-family: Times New Roman; color: black; text-align: center; padding: 25px; ">
        <p style="font-size: 16px;">Click on the button to reset the password.</p>
        <a href="http://localhost:3000/password/reset/${token}" 
            style="
            background-color: #4CAF50; 
            color: white; 
            padding: 10px 20px; 
            border: none; 
            cursor: pointer; 
            border-radius: 5px; 
            text-decoration: none;"
        >Click</a>
    </div>`;

    sendEmailFromSite({ sender: process.env.EMAIL_ADDRESS, receiver: user.email, subject: "Password Reset", message });

    res.status(200).json({
        success: true,
        message: `Email sent to ${user.email}`
    })
});


//reset password
export const resetPassword = catchAsyncError(async (req, res, next) => {
    const passwordResetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken, passwordResetExpire: { $gt: Date.now() } })
    if (!user) return next(new ErrorHandler('Token expired!', 401))
    if (req.body.password != req.body.confirmPassword) return next(new ErrorHandler('Password do not match', 400))

    user.password = req.body.password;
    user.confirmPassword = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password reset successfully!',
    });
});
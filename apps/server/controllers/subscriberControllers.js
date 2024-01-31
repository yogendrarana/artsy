import ErrorHandler from "../util/errorHandler.js";
import { Subscriber } from "../models/subscriberModel.js";

//subscribe
export const addSubscriber = async (req, res, next) => {
    try {
        const { email } = req.body;
        await Subscriber.create({ email });

        res.status(201).json({
            success: true,
            message: 'Subscription registered successfully!'
        });
    }catch (err) {
        if (err.code == "11000")
            return next(new ErrorHandler("Email is already subscribed.", 400));
        else
            return next(new ErrorHandler(err.message, err.code));
    }
}
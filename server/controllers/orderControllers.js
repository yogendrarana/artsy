import moment from 'moment';
import { Art } from "../models/artModel.js";
import { Order } from "../models/orderModel.js";
import ErrorHandler from "../util/errorHandler.js";
import { OrderItem } from '../models/orderItemModel.js';
import catchAsyncError from "../util/catchAsyncError.js";
import sendEmailFromSite from "../util/sendEmailFromSite.js";


//create new order
export const createOrder = catchAsyncError(async (req, res, next) => {
    const { shippingDetail, orderItems, paymentDetail, orderSubtotal, taxPrice, shippingPrice, orderTotal } = req.body.orderData;

    // create order
    const order = await Order.create({
        customerId: req.user._id,
        shippingDetail,
        paymentDetail,
        orderSubtotal,
        taxPrice,
        shippingPrice,
        orderTotal,
    })

    // create orderItems
    for (const item of orderItems) {
        await OrderItem.create({
            orderId: order._id,
            artId: item._id,
        })
    }

    // Update artStatus of all orderItems to 'sold'
    const orderItemIds = orderItems.map(item => item._id);
    await Art.updateMany({ _id: { $in: orderItemIds } }, { artStatus: 'sold' });

    // send email notification 
    const message =
        `<div style="height: 100px; background-color: #f0f0f0; font-family: Times New Roman; color: black; text-align: center; padding: 25px; ">
        <p style="font-size: 16px;">Thank you ${shippingDetail.name} for making order using our site. We will notify you again when the order is shipped.</p>
    </div>`;

    sendEmailFromSite({ sender: process.env.EMAIL_ADDRESS, receiver: shippingDetail.email, subject: "Order Confirmed", message });

    // send download link for images: `${req.protocol}://${req.get('host')}/password/reset/${token}`
    for (const item of orderItems) {
        if (item.category === "photography") {
            const DownloadImageLink =
                `<div style="height: 100px; background-color: #f0f0f0; font-family: Times New Roman; color: black; text-align: center; padding: 25px; ">
                <p style="font-size: 16px;">Click on the button to download the image.</p>
                <a href="http://localhost:3000/download-image/${item._id}"
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
            const message = `Thank you for buying art from us. You can download your image from this link:\n\n${DownloadImageLink}`;
            sendEmailFromSite({ sender: process.env.EMAIL_ADDRESS, receiver: shippingDetail.email, subject: "Photography Art Download Link", message });
        }
    }

    res.status(201).json({
        success: true,
        message: "Order placed successfully.",
        order
    })
})


//get all orders 
export const getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();

    res.status(200).json({
        success: true,
        orders
    })
})


//delete order
export const deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) { return next(new ErrorHandler("Order does not exist", 404)) }

    await order.remove()

    res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
        order
    })
})


// get my orders
export const getOrdersMade = catchAsyncError(async (req, res, next) => {
    const ordersMade = await Order.find({ customerId: req.user._id })

    res.status(200).json({
        success: true,
        ordersMade
    })
})


export const getOrdersReceived = catchAsyncError(async (req, res, next) => {
    const ordersReceived = await OrderItem.aggregate([
        { $lookup: { from: "arts", localField: "artId", foreignField: "_id", as: "art" } },
        { $unwind: "$art" },
        { $match: { "art.creatorId": req.user._id } },
        { $lookup: { from: "orders", localField: "orderId", foreignField: "_id", as: "order" } },
        { $unwind: "$order" },
        { $group: { _id: "$orderId", order: { $first: "$order" }, arts: { $push: "$art" } } },
        { $sort: { "order.orderCreatedOn": -1 } }
    ])

    res.status(200).json({
        success: true,
        ordersReceived
    })
})


// update order
export const updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) { return next(new ErrorHandler("Order does not exist", 404)) }
    if (req.body.orderStatus === '') { return next(new ErrorHandler("Invalid order status.", 404)) }
    if (order.orderStatus === "delivered") { return next(new ErrorHandler('The order has already been delivered', 400)) }

    order.orderStatus = req.body.orderStatus;

    if (req.body.orderStatus === 'shipped') {
        order.shippedOn = Date.now();

        // send email notification
        const orderCreatedOn = moment(order.orderCreatedOn).format('YYYY-MM-DD');
        const message = `Hello ${order.shippingDetail.name}. \nWe are writing this email to inform you that your order which was made on  ${orderCreatedOn} has been shipped successfully! \nThank you for purchasing the art from our website!`
        sendEmailFromSite({ sender: process.env.EMAIL_ADDRESS, receiver: order.shippingDetail.email, subject: "Order Shipped", message });
    }

    if (req.body.orderStatus === 'delivered') {
        order.deliveredOn = Date.now();
    }

    await order.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        message: 'Order updated successfully'
    })
})



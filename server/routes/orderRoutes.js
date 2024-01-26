import express from 'express'
import * as authMiddleware from '../middleware/authMiddleware.js'
import * as orderControllers from '../controllers/orderControllers.js';

const router = express.Router();

// general users routes
router.route('/order/new').post(authMiddleware.verifyAccessToken, orderControllers.createOrder);
router.route('/orders/made').get(authMiddleware.verifyAccessToken, orderControllers.getOrdersMade);
router.route('/orders/received').get(authMiddleware.verifyAccessToken, orderControllers.getOrdersReceived);

//admin routes
router.route('/admin/order/:id').put(authMiddleware.verifyAccessToken, authMiddleware.isAdmin, orderControllers.updateOrder);
router.route('/admin/orders').get(authMiddleware.verifyAccessToken, authMiddleware.isAdmin, orderControllers.getAllOrders);
router.route('/admin/order/:id').delete(authMiddleware.verifyAccessToken, authMiddleware.isAdmin, orderControllers.deleteOrder);

export default router;
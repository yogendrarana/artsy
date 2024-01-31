import express from 'express'
const router = express.Router();
import * as paymentControllers from '../controllers/paymentControllers.js';

// stripe routes
router.route('/stripe-publishable-key').get(paymentControllers.getStripePK);
router.route('/create-payment-intent').post(paymentControllers.createPaymentIntent);


// khalti routes
router.route('/verify-payment').post(paymentControllers.verifyKhaltiPayment);

export default router
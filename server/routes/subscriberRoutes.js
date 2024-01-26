import express from 'express'

const router = express.Router();    

// import controllers
import * as subscriberControllers from '../controllers/subscriberControllers.js';

// routes
router.route('/subscribe').post(subscriberControllers.addSubscriber);

export default router;
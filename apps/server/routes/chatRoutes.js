import express from 'express'
import * as authMiddleware from "../middleware/authMiddleware.js";
import * as chatControllers from '../controllers/chatControllers.js';

const router = express.Router();

router.route('/chats').get(authMiddleware.verifyAccessToken, chatControllers.getMyChats);
router.route('/messages').get(authMiddleware.verifyAccessToken, chatControllers.getChatMessages);
router.route('/message/new').post(authMiddleware.verifyAccessToken, chatControllers.newMessage);

export default router
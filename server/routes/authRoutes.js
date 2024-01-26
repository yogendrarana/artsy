import express from "express";
import * as authMiddleware from '../middleware/authMiddleware.js'
import * as authControllers from "../controllers/authControllers.js";

const router = express.Router();

router.route('/login').post(authControllers.handleLogin);
router.route('/register').post(authControllers.handleRegister);
router.route('/logout').get(authMiddleware.verifyAccessToken, authControllers.handleLogout);

router.route('/password/forget').post(authControllers.forgetPassword)
router.route('/password/reset/:token').put(authControllers.resetPassword)
router.route('/password/update').put(authMiddleware.verifyAccessToken, authControllers.updatePassword)

router.route('/refresh-access-token').get(authControllers.handleRenewAccessToken);

export default router;
import express from 'express'
import * as authMiddleware from '../middleware/authMiddleware.js';
import * as adminControllers from '../controllers/adminControllers.js';

// express router
const router = express.Router();

router.route('/admin/stats').get(authMiddleware.verifyAccessToken, authMiddleware.isAdmin, adminControllers.getStats);
router.route('/admin/users').get(authMiddleware.verifyAccessToken, authMiddleware.isAdmin, adminControllers.getAllUsers);
router.route('/admin/user/delete/:id').delete(authMiddleware.verifyAccessToken, authMiddleware.isAdmin, adminControllers.deleteUser);

export default router;
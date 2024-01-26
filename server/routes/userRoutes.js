import express from 'express'
import * as authMiddleware from '../middleware/authMiddleware.js'
import * as userControllers from '../controllers/userControllers.js'
import * as adminControllers from '../controllers/adminControllers.js'


const router = express.Router()


// general user routes
router.route('/user/:id').get(userControllers.getUserProfile)
router.route('/send/email').post(userControllers.sendMailFromContact)


// logged in user routes
router.route('/profile/me').get(authMiddleware.verifyAccessToken, userControllers.getMyProfileData)
router.route('/profile/update').put(authMiddleware.verifyAccessToken, userControllers.updateProfile)
router.route('/profile/avatar/update').put(authMiddleware.verifyAccessToken, userControllers.updateAvatar)
router.route('/account/delete/:id').delete(authMiddleware.verifyAccessToken, userControllers.deleteAccount)

export default router;
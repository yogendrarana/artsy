import express from "express"
import * as authMiddleware from "../middleware/authMiddleware.js";
import { uploadMultiple } from "../middleware/multerMiddleware.js";
import * as artControllers from "../controllers/artControllers.js";

const router = express.Router();

// api/v1/arts
router.route('/arts').get(artControllers.readArts)
router.route('/artworks/:id').get(artControllers.getUserArtworks)
router.route('/art/upload').post(authMiddleware.verifyAccessToken, authMiddleware.isCreator, uploadMultiple.array('artImages', 6), artControllers.createArt)


// api/v1/art/:id
router.route('/art/:id').get(artControllers.readArt)
router.route('/art/delete/:id').delete(authMiddleware.verifyAccessToken, authMiddleware.isCreator, artControllers.deleteArt)
router.route('/art/update/:id').put(authMiddleware.verifyAccessToken, authMiddleware.isCreator, artControllers.updateArt)
router.route('/art/:id/reviews').get(artControllers.getReviews)
router.route('/art/:id/reviews').post(authMiddleware.verifyAccessToken, artControllers.createReview)


// api/v1/arts/recommendations
router.route('/arts/recommendations').get(artControllers.getRecommendations)


// api/v1/arts/reviews
router.route('/arts/review/delete/:id').delete(authMiddleware.verifyAccessToken, artControllers.deleteReview)


// api/v1/art/auction
router.route('/art/auction/highest-bid').get(artControllers.findHighestBid);
router.route('/auction/bid').post(authMiddleware.verifyAccessToken, artControllers.placeBid)


// api/v1/art/likes
router.route('/likes/add').post(authMiddleware.verifyAccessToken, artControllers.addToLikes)
router.route('/likes/remove').delete(authMiddleware.verifyAccessToken, artControllers.removeFromLikes)


export default router;
import { Router } from "express";
const router = Router();
import { TourController } from "../controllers";
import { verifyToken } from '../utils/verify-token';

router.route('/public-tours')
    .get(TourController.getAllPublic);

router.route('/tour')
    .get(verifyToken, TourController.getAll)
    .post(verifyToken, TourController.create);

router.route('/tour/:id')
    .get(verifyToken, TourController.getById)
    .delete(verifyToken, TourController.deleteTour);

router.route('/tour/:id/cover')
    .post(verifyToken, TourController.uploadCover);

router.route('/tour/:id/place/:placeId')
    .get(verifyToken, TourController.getPlace);

export default router;
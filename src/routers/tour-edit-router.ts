import { Router } from "express";
const router = Router();
import { TourEditController } from "../controllers";
import { verifyToken } from '../utils/verify-token';
import { verifySession } from '../utils/verify-session';

router.route('/tour-edit/:id').post(verifyToken, TourEditController.startEditing);

router.route('/tour-edit/:sessionId/get')
    .get(verifyToken, verifySession, TourEditController.get);
router.route('/tour-edit/:sessionId/save')
    .post(verifyToken, verifySession, TourEditController.saveChanges);
router.route('/tour-edit/:sessionId/cancel')
    .post(verifyToken, verifySession, TourEditController.cancelChanges);
router.route('/tour-edit/:sessionId/uploadMapImage')
    .post(verifyToken, verifySession, TourEditController.uploadMapImage);
//TODO: rename pathes to /place/
router.route('/tour-edit/:sessionId/addPlace')
    .post(verifyToken, verifySession, TourEditController.addPlace);
//TODO: rename pathes to /connection/
router.route('/tour-edit/:sessionId/addConnnection')
    .post(verifyToken, verifySession, TourEditController.addConnection);
router.route('/tour-edit/:sessionId/removeConnection/:place1Id/:place2Id')
    .delete(verifyToken, verifySession, TourEditController.deleteConnection);
router.route('/tour-edit/:sessionId/connection/:id')
    .get(verifyToken, verifySession, TourEditController.getConnection)
router.route('/tour-edit/:sessionId/connection')
    .put(verifyToken, verifySession, TourEditController.updateConnection);

router.route('/tour-edit/:sessionId/place/:placeId')
    .get(verifyToken, verifySession, TourEditController.getPlace)
    .delete(verifyToken, verifySession, TourEditController.removePlace);

router.route('/tour-edit/:sessionId/place/:placeId/sound')
    .post(verifyToken, verifySession, TourEditController.uploadSound)
    .delete(verifyToken, verifySession, TourEditController.removeSound);

router.route('/tour-edit/:sessionId/place')
    .put(verifyToken, verifySession, TourEditController.updatePlace);

router.route('/tour-edit/:sessionId/place/:placeId/uploadImage360')
    .post(verifyToken, verifySession, TourEditController.uploadImage360);
router.route('/tour-edit/:sessionId/place/:placeId/uploadPlaceCover')
    .post(verifyToken, verifySession, TourEditController.uploadPlaceCover);
router.route('/tour-edit/:sessionId/place/:placeId/uploadMapPlaceIcon')
    .post(verifyToken, verifySession, TourEditController.uploadMapPlaceIcon);
router.route('/tour-edit/:sessionId/place/:placeId/removeMapPlaceIcon')
    .delete(verifyToken, verifySession, TourEditController.removeMapPlaceIcon);
export default router;
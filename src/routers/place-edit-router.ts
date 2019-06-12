import { Router } from "express";
const router = Router();
import { verifyToken } from '../utils/verify-token';
import { verifySession } from '../utils/verify-session';
import { PlaceEditController } from '../controllers';

router.route('/place-edit/')
    .post(verifyToken, PlaceEditController.startEditing);
router.route('/place-edit/:sessionId/get')
    .get(verifyToken, verifySession, PlaceEditController.get);
router.route('/place-edit/:sessionId/cancel')
    .post(verifyToken, verifySession, PlaceEditController.cancelChanges);
router.route('/place-edit/:sessionId/save')
    .post(verifyToken, verifySession, PlaceEditController.saveChanges);
router.route('/place-edit/:sessionId/addWidget')
    .post(verifyToken, verifySession, PlaceEditController.addWidget);
router.route('/place-edit/:sessionId/updateRunVideo')
    .post(verifyToken, verifySession, PlaceEditController.updateRunVideo);
router.route('/place-edit/:sessionId/imageWidget/:widgetID')
    .post(verifyToken, verifySession, PlaceEditController.updateImageWidget)
    .delete(verifyToken, verifySession, PlaceEditController.removeImageFromImageWidget);

export default router;

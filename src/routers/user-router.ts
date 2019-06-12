
import { Router } from "express";
const router = Router();
import { signup, signin, editUser, getUserById } from '../controllers/user-controller';
import { verifyToken } from '../utils/verify-token';

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/editUser', verifyToken, editUser)
router.get('/users/:id', verifyToken, getUserById);

export default router;
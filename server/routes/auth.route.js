import express from 'express';
import { forgotPassword, getAuthUser, login, logOut, register, resetPassword, verifyEmail } from '../controllers/auth.controlller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();


router.post('/register',register)
router.post('/login',login)
router.post('/logout',logOut)

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/me",verifyToken, getAuthUser);
export default router;







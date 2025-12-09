import express from 'express';
import { register, login, logout, getMe, updateProfile, changePassword, refreshToken } from '../controllers/authController.js';
import { validateRegister, validateLogin, validateProfileUpdate, validatePasswordChange } from '../validators/authValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, validateRequest(validateRegister), register);
router.post('/login', authLimiter, validateRequest(validateLogin), login);

router.use(protect);
router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', validateRequest(validateProfileUpdate), updateProfile);
router.put('/password', validateRequest(validatePasswordChange), changePassword);
router.post('/refresh', refreshToken);

export default router;

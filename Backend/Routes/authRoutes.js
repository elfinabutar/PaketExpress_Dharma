import express from 'express';
import authController from '../Controllers/authController.js';
import { authApi } from '../Middleware/auth.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/profile', authApi, authController.getProfile);

export default router;
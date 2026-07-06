import express from 'express';
import { getProfile, updateProfile, changePassword } from '../Controllers/userController.js';
import { authApi } from '../Middleware/auth.js';

const router = express.Router();

/**
 * GET /api/users/profile
 * Dapatkan profil user
 */
router.get('/profile', authApi, getProfile);

/**
 * PUT /api/users/profile
 * Update profil user
 */
router.put('/profile', authApi, updateProfile);

/**
 * PUT /api/users/change-password
 * Update password user
 */
router.put('/change-password', authApi, changePassword);

export default router;

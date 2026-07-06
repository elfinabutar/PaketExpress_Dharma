import express from 'express';
import { register, login, logout } from '../Controllers/authController.js';
import { validateEmail, validatePassword } from '../Middleware/validation.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Registrasi user baru
 */
router.post('/register', validateEmail, validatePassword, register);

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', validateEmail, login);

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', logout);

export default router;

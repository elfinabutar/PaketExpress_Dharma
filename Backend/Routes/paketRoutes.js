import express from 'express';
import { getAllPaket, getPaketById, createPaket, lacakPaket, updateStatus } from '../Controllers/paketController.js';
import { authApi } from '../Middleware/auth.js';

const router = express.Router();

/**
 * GET /api/paket
 * Dapatkan semua paket
 */
router.get('/', authApi, getAllPaket);

/**
 * POST /api/paket
 * Buat paket baru
 */
router.post('/', authApi, createPaket);

/**
 * GET /api/paket/:id
 * Dapatkan paket by ID
 */
router.get('/:id', authApi, getPaketById);

/**
 * GET /api/paket/lacak/:no_resi
 * Lacak paket berdasarkan no resi
 */
router.get('/lacak/:no_resi', authApi, lacakPaket);

/**
 * PUT /api/paket/:id/status
 * Update status paket
 */
router.put('/:id/status', authApi, updateStatus);

export default router;

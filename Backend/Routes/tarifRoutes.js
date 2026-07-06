import express from 'express';
import { getAllTarif, hitungTarif, getKotaList } from '../Controllers/tarifController.js';
import { authApi } from '../Middleware/auth.js';

const router = express.Router();

/**
 * GET /api/tarif
 * Dapatkan semua tarif
 */
router.get('/', authApi, getAllTarif);

/**
 * POST /api/tarif/hitung
 * Hitung tarif berdasarkan berat
 */
router.post('/hitung', authApi, hitungTarif);

/**
 * GET /api/kota
 * Dapatkan daftar kota
 */
router.get('/kota', authApi, getKotaList);

export default router;

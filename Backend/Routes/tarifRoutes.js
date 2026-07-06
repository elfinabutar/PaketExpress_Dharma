import express from 'express';
import tarifController from '../Controllers/tarifController.js';
import { authApi } from '../Middleware/auth.js';

const router = express.Router();

router.get('/', tarifController.getAllTarif);
router.get('/kota', tarifController.getKota);
router.get('/cek', tarifController.cekTarif);

export default router;
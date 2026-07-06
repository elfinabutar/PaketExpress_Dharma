import express from 'express';
import paketController from '../Controllers/paketController.js';
import { authApi, adminOnly } from '../Middleware/auth.js';

const router = express.Router();

router.use(authApi);

router.post('/', paketController.createPaket);
router.get('/', paketController.getMyPackets);
router.get('/:id', paketController.getPaketById);
router.put('/:id/status', adminOnly, paketController.updateStatus);

export default router;
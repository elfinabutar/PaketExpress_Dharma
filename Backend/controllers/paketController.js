import { Paket } from '../Models/Paket.js';
import { Tarif } from '../Models/Tarif.js';
import database from '../Config/database.js';
import { sendResponse } from '../Utils/responseHandler.js';

class PaketController {
    constructor() {
        this.paketModel = null;
        this.tarifModel = null;
        this.initModels();
    }

    async initModels() {
        const db = await database.getConnection();
        this.paketModel = new Paket(db);
        this.tarifModel = new Tarif(db);
    }

    createPaket = async (req, res) => {
        try {
            const packetData = { ...req.body, user_id: req.user.id };
            
            const newPaket = await this.paketModel.createPaket(packetData);
            sendResponse(res, 201, true, 'Paket berhasil dibuat!', { paket: newPaket });
        } catch (error) {
            sendResponse(res, 500, false, error.message);
        }
    }

    getMyPackets = async (req, res) => {
        try {
            const packets = await this.paketModel.findAll({ user_id: req.user.id });
            sendResponse(res, 200, true, 'Riwayat paket', { paket: packets });
        } catch (error) {
            sendResponse(res, 500, false, error.message);
        }
    }

    getPaketById = async (req, res) => {
        try {
            const { id } = req.params;
            const paket = await this.paketModel.findById(id, 'idpaket');
            
            if (!paket) {
                return sendResponse(res, 404, false, 'Paket tidak ditemukan');
            }

            if (paket.user_id !== req.user.id && req.user.role !== 'admin') {
                return sendResponse(res, 403, false, 'Akses ditolak');
            }

            const tracking = await this.paketModel.getTrackingHistory(id);
            sendResponse(res, 200, true, 'Detail paket', { paket, tracking });
        } catch (error) {
            sendResponse(res, 500, false, error.message);
        }
    }

    lacakPaket = async (req, res) => {
        try {
            const { no_resi } = req.params;
            const paket = await this.paketModel.getPaketByResi(no_resi);
            
            if (!paket) {
                return sendResponse(res, 404, false, 'Nomor resi tidak ditemukan');
            }

            const tracking = await this.paketModel.getTrackingHistory(paket.idpaket);
            sendResponse(res, 200, true, 'Hasil lacak paket', { paket, tracking });
        } catch (error) {
            sendResponse(res, 500, false, error.message);
        }
    }

    updateStatus = async (req, res) => {
        try {
            const { id } = req.params;
            const { status, lokasi, keterangan } = req.body;

            if (req.user.role !== 'admin') {
                return sendResponse(res, 403, false, 'Hanya admin yang dapat update status');
            }

            const paket = await this.paketModel.updateStatus(id, status, lokasi, keterangan);
            sendResponse(res, 200, true, 'Status paket berhasil diupdate', { paket });
        } catch (error) {
            sendResponse(res, 500, false, error.message);
        }
    }
}

export default new PaketController();
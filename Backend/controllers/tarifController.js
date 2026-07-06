import { Tarif } from '../Models/Tarif.js';
import database from '../Config/database.js';
import { sendResponse } from '../Utils/responseHandler.js';

class TarifController {
    constructor() {
        this.tarifModel = null;
        this.initModel();
    }

    async initModel() {
        const db = await database.getConnection();
        this.tarifModel = new Tarif(db);
    }

    getAllTarif = async (req, res) => {
        try {
            const tarif = await this.tarifModel.findAll();
            sendResponse(res, 200, true, 'Daftar tarif pengiriman', { tarif });
        } catch (error) {
            sendResponse(res, 500, false, error.message);
        }
    }

    getKota = async (req, res) => {
        try {
            const kota = await this.tarifModel.getAllKota();
            sendResponse(res, 200, true, 'Daftar kota', kota);
        } catch (error) {
            sendResponse(res, 500, false, error.message);
        }
    }

    cekTarif = async (req, res) => {
        try {
            const { kota_asal, kota_tujuan } = req.query;
            const tarif = await this.tarifModel.searchTarif(kota_asal, kota_tujuan);
            sendResponse(res, 200, true, 'Hasil cek tarif', { tarif });
        } catch (error) {
            sendResponse(res, 500, false, error.message);
        }
    }
}

export default new TarifController();
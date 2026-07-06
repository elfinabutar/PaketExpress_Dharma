import db from '../Config/db.js';

/**
 * Dapatkan semua tarif
 * GET /api/tarif
 */
export const getAllTarif = async (req, res, next) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM tarif ORDER BY berat_awal ASC'
        );
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Hitung tarif berdasarkan berat
 * POST /api/tarif/hitung
 */
export const hitungTarif = async (req, res, next) => {
    try {
        const { berat } = req.body;
        
        if (!berat) {
            return res.status(400).json({
                success: false,
                message: 'Berat wajib diisi'
            });
        }
        
        const [rows] = await db.query(
            'SELECT * FROM tarif WHERE berat_awal <= ? AND berat_akhir >= ? LIMIT 1',
            [berat, berat]
        );
        
        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: 'Tarif tidak ditemukan untuk berat ini'
            });
        }
        
        res.json({
            success: true,
            data: {
                berat,
                harga: rows[0].harga,
                keterangan: rows[0].keterangan
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Dapatkan daftar kota
 * GET /api/kota
 */
export const getKotaList = async (req, res, next) => {
    try {
        const [rows] = await db.query(
            'SELECT DISTINCT nama_kota FROM kota ORDER BY nama_kota'
        );
        
        res.json({
            success: true,
            count: rows.length,
            data: rows.map(r => r.nama_kota)
        });
    } catch (err) {
        next(err);
    }
};

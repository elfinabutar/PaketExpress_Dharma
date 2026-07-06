import db from '../Config/db.js';

/**
 * Dapatkan semua paket
 * GET /api/paket
 */
export const getAllPaket = async (req, res, next) => {
    try {
        const [rows] = await db.query(
            `SELECT p.*, u.nama as pengirim, s.status as status_terbaru 
             FROM paket p 
             LEFT JOIN users u ON p.user_id = u.idusers 
             LEFT JOIN status_paket s ON p.idpaket = s.paket_id
             ORDER BY p.created_at DESC`
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
 * Dapatkan paket by ID
 * GET /api/paket/:id
 */
export const getPaketById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.query(
            `SELECT p.*, u.nama as pengirim 
             FROM paket p 
             LEFT JOIN users u ON p.user_id = u.idusers 
             WHERE p.idpaket = ?`,
            [id]
        );
        
        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: 'Paket tidak ditemukan'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Buat paket baru
 * POST /api/paket
 */
export const createPaket = async (req, res, next) => {
    try {
        const { no_resi, nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, berat, tarif } = req.body;
        
        // Validasi
        if (!no_resi || !nama_pengirim || !alamat_pengirim || !nama_penerima || !alamat_penerima || !berat) {
            return res.status(400).json({
                success: false,
                message: 'Semua field wajib diisi'
            });
        }
        
        const [result] = await db.query(
            `INSERT INTO paket (user_id, no_resi, nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, berat, tarif, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [req.user.id, no_resi, nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, berat, tarif || 0]
        );
        
        res.status(201).json({
            success: true,
            message: 'Paket berhasil dibuat',
            data: { idpaket: result.insertId, no_resi }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Lacak paket
 * GET /api/paket/lacak/:no_resi
 */
export const lacakPaket = async (req, res, next) => {
    try {
        const { no_resi } = req.params;
        
        const [rows] = await db.query(
            `SELECT p.*, 
                    JSON_ARRAYAGG(JSON_OBJECT('status', sp.status, 'waktu', sp.created_at)) as riwayat_status
             FROM paket p 
             LEFT JOIN status_paket sp ON p.idpaket = sp.paket_id
             WHERE p.no_resi = ?
             GROUP BY p.idpaket`,
            [no_resi]
        );
        
        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: 'Paket tidak ditemukan'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Update status paket
 * PUT /api/paket/:id/status
 */
export const updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status wajib diisi'
            });
        }
        
        // Update paket status
        await db.query('UPDATE paket SET status = ? WHERE idpaket = ?', [status, id]);
        
        // Insert history
        await db.query(
            'INSERT INTO status_paket (paket_id, status, keterangan) VALUES (?, ?, ?)',
            [id, status, `Status diubah menjadi ${status}`]
        );
        
        res.json({
            success: true,
            message: 'Status paket berhasil diperbarui'
        });
    } catch (err) {
        next(err);
    }
};

import db from "./Config/db.js";

// ============================================
// TARIF
// ============================================
export const getAllTarif = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM tarif");
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getKotaList = async (req, res) => {
    try {
        const [asal] = await db.query("SELECT DISTINCT kota_asal as kota FROM tarif");
        const [tujuan] = await db.query("SELECT DISTINCT kota_tujuan as kota FROM tarif");
        res.json({ 
            success: true,
            kota_asal: asal.map(a => a.kota), 
            kota_tujuan: tujuan.map(t => t.kota) 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ============================================
// PAKET
// ============================================
function generateResi() {
    return `PKT${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 10000)}`;
}

export const createPaket = async (req, res) => {
    try {
        const {
            idtarif, nama_pengirim, alamat_pengirim, telepon_pengirim,
            nama_penerima, alamat_penerima, telepon_penerima, berat_kg, catatan
        } = req.body;
        
        const [tarifData] = await db.query("SELECT harga_per_kg FROM tarif WHERE idtarif = ?", [idtarif]);
        const total_harga = berat_kg * tarifData[0].harga_per_kg;
        const no_resi = generateResi();
        
        const [result] = await db.query(
            `INSERT INTO paket (no_resi, user_id, idtarif, nama_pengirim, alamat_pengirim, 
             telepon_pengirim, nama_penerima, alamat_penerima, telepon_penerima, 
             berat_kg, total_harga, catatan, tanggal_kirim, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 'pending')`,
            [no_resi, req.user.id, idtarif, nama_pengirim, alamat_pengirim, telepon_pengirim,
             nama_penerima, alamat_penerima, telepon_penerima, berat_kg, total_harga, catatan || null]
        );
        
        await db.query(`INSERT INTO tracking (idpaket, status, lokasi, keterangan) VALUES (?, 'pending', 'Pusat', 'Paket telah dipesan')`, [result.insertId]);
        
        res.json({ success: true, message: "Paket berhasil dikirim!", no_resi, total_harga });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getAllPaket = async (req, res) => {
    try {
        const [data] = await db.query(
            `SELECT p.*, t.kota_asal, t.kota_tujuan 
             FROM paket p JOIN tarif t ON p.idtarif = t.idtarif 
             WHERE p.user_id = ? ORDER BY p.created_at DESC`,
            [req.user.id]
        );
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message, data: [] });
    }
};

export const getPaketById = async (req, res) => {
    try {
        const [paket] = await db.query(`SELECT p.*, t.kota_asal, t.kota_tujuan FROM paket p JOIN tarif t ON p.idtarif = t.idtarif WHERE p.idpaket = ?`, [req.params.id]);
        if (paket.length === 0) return res.status(404).json({ success: false, message: "Paket tidak ditemukan" });
        
        const [tracking] = await db.query(`SELECT * FROM tracking WHERE idpaket = ? ORDER BY created_at DESC`, [req.params.id]);
        res.json({ success: true, data: { ...paket[0], tracking } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const lacakPaket = async (req, res) => {
    try {
        const [paket] = await db.query(`SELECT p.*, t.kota_asal, t.kota_tujuan FROM paket p JOIN tarif t ON p.idtarif = t.idtarif WHERE p.no_resi = ?`, [req.params.no_resi]);
        if (paket.length === 0) return res.status(404).json({ success: false, message: "Nomor resi tidak ditemukan" });
        
        const [tracking] = await db.query(`SELECT * FROM tracking WHERE idpaket = ? ORDER BY created_at DESC`, [paket[0].idpaket]);
        res.json({ success: true, data: { ...paket[0], tracking } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateStatus = async (req, res) => {
    try {
        await db.query("UPDATE paket SET status = ? WHERE idpaket = ?", [req.body.status, req.params.id]);
        await db.query(`INSERT INTO tracking (idpaket, status, lokasi, keterangan) VALUES (?, ?, ?, ?)`, [req.params.id, req.body.status, req.body.lokasi || '-', req.body.keterangan || `Status berubah menjadi ${req.body.status}`]);
        res.json({ success: true, message: "Status paket berhasil diupdate" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
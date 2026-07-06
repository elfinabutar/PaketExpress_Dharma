// Get all paket by user
export const getAllPaket = async (req, res) => {
    console.log('📦 getAllPaket called - User ID:', req.user?.id);
    
    try {
        const user_id = req.user.id;
        console.log('📦 Querying paket for user_id:', user_id);
        
        const [data] = await db.query(
            `SELECT p.*, t.kota_asal, t.kota_tujuan, t.estimasi_hari 
             FROM paket p 
             JOIN tarif t ON p.idtarif = t.idtarif 
             WHERE p.user_id = ? 
             ORDER BY p.created_at DESC`,
            [user_id]
        );
        
        console.log('📦 Query result - Total paket found:', data.length);
        
        res.json({ 
            success: true, 
            data: data,
            message: "Data berhasil dimuat"
        });
    } catch (err) {
        console.error('❌ ERROR in getAllPaket:', err.message);
        console.error('❌ Full error:', err);
        res.status(500).json({ 
            success: false, 
            message: err.message,
            error: err.message,
            data: [] 
        });
    }
};
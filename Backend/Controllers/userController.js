import db from '../Config/db.js';

/**
 * Dapatkan profil user
 * GET /api/users/profile
 */
export const getProfile = async (req, res, next) => {
    try {
        const [rows] = await db.query(
            'SELECT idusers, nama, email, no_telepon, alamat, role, created_at FROM users WHERE idusers = ?',
            [req.user.id]
        );
        
        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
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
 * Update profil user
 * PUT /api/users/profile
 */
export const updateProfile = async (req, res, next) => {
    try {
        const { nama, no_telepon, alamat } = req.body;
        
        await db.query(
            'UPDATE users SET nama = COALESCE(?, nama), no_telepon = COALESCE(?, no_telepon), alamat = COALESCE(?, alamat) WHERE idusers = ?',
            [nama || null, no_telepon || null, alamat || null, req.user.id]
        );
        
        res.json({
            success: true,
            message: 'Profil berhasil diperbarui'
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Update password user
 * PUT /api/users/change-password
 */
export const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password lama dan baru wajib diisi'
            });
        }
        
        // Get current user
        const [rows] = await db.query('SELECT password FROM users WHERE idusers = ?', [req.user.id]);
        const user = rows[0];
        
        // Verify old password
        const bcrypt = require('bcrypt');
        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Password lama tidak sesuai'
            });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password
        await db.query('UPDATE users SET password = ? WHERE idusers = ?', [hashedPassword, req.user.id]);
        
        res.json({
            success: true,
            message: 'Password berhasil diubah'
        });
    } catch (err) {
        next(err);
    }
};

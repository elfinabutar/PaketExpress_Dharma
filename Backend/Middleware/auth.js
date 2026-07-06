import jwt from 'jsonwebtoken';
import env from '../Config/environment.js';

/**
 * Middleware untuk autentikasi halaman (page authentication)
 * Menggunakan cookie token untuk validasi
 */
export const authPage = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.redirect('/login');
    
    try {
        req.user = jwt.verify(token, env.SECRET);
        next();
    } catch (err) {
        res.clearCookie('token');
        res.redirect('/login');
    }
};

/**
 * Middleware untuk autentikasi API
 * Menggunakan Bearer token dari header Authorization
 */
export const authApi = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak ditemukan. Silakan login terlebih dahulu.'
        });
    }
    
    try {
        req.user = jwt.verify(token, env.SECRET);
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: 'Token tidak valid atau sudah kadaluarsa'
        });
    }
};

/**
 * Middleware untuk otorisasi berdasarkan role
 * @param {array} roles - Daftar role yang diizinkan
 */
export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Anda harus login terlebih dahulu'
            });
        }
        
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Anda tidak memiliki akses ke resource ini'
            });
        }
        
        next();
    };
};

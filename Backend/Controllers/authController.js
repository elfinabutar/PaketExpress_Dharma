import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../Config/db.js';
import env from '../Config/environment.js';

/**
 * Registrasi user baru
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
    try {
        const { nama, email, password, no_telepon, alamat, role = 'customer' } = req.body;
        
        // Validasi input
        if (!nama || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nama, email, dan password wajib diisi'
            });
        }
        
        // Cek email sudah terdaftar
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user
        await db.query(
            'INSERT INTO users (nama, email, password, no_telepon, alamat, role) VALUES (?, ?, ?, ?, ?, ?)',
            [nama, email, hashedPassword, no_telepon || null, alamat || null, role]
        );
        
        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil! Silakan login.'
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Validasi input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email dan password wajib diisi'
            });
        }
        
        // Cari user
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email tidak ditemukan'
            });
        }
        
        // Verifikasi password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Password salah'
            });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.idusers,
                nama: user.nama,
                email: user.email,
                role: user.role
            },
            env.SECRET,
            { expiresIn: env.JWT_EXPIRES }
        );
        
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        res.json({
            success: true,
            message: 'Login berhasil!',
            data: {
                id: user.idusers,
                nama: user.nama,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = (req, res) => {
    res.clearCookie('token');
    res.json({
        success: true,
        message: 'Logout berhasil'
    });
};

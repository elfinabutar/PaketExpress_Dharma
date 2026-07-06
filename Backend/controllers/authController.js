import { User } from '../Models/User.js';
import database from '../Config/database.js';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../Utils/responseHandler.js';

const SECRET_KEY = process.env.JWT_SECRET || 'paketexpress2026#';

class AuthController {
    constructor() {
        this.userModel = null;
        this.initModel();
    }

    async initModel() {
        const db = await database.getConnection();
        this.userModel = new User(db);
    }

    register = async (req, res) => {
        try {
            const { nama, email, password, no_telepon, alamat } = req.body;
            
            if (!nama || !email || !password) {
                return sendResponse(res, 400, false, 'Nama, email, dan password wajib diisi');
            }

            const newUser = await this.userModel.register({ nama, email, password, no_telepon, alamat });
            sendResponse(res, 201, true, 'Registrasi berhasil! Silakan login', { user: newUser });
        } catch (error) {
            sendResponse(res, 500, false, error.message);
        }
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return sendResponse(res, 400, false, 'Email dan password wajib diisi');
            }

            const user = await this.userModel.login(email, password);
            
            const token = jwt.sign(
                { id: user.idusers, nama: user.nama, email: user.email, role: user.role },
                SECRET_KEY,
                { expiresIn: '7d' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'strict'
            });

            sendResponse(res, 200, true, 'Login berhasil!', { 
                user: { nama: user.nama, email: user.email, role: user.role },
                token 
            });
        } catch (error) {
            sendResponse(res, 401, false, error.message);
        }
    }

    logout = async (req, res) => {
        res.clearCookie('token');
        sendResponse(res, 200, true, 'Logout berhasil');
    }

    getProfile = async (req, res) => {
        try {
            const user = await this.userModel.findById(req.user.id, 'idusers');
            if (!user) {
                return sendResponse(res, 404, false, 'User tidak ditemukan');
            }
            delete user.password;
            sendResponse(res, 200, true, 'Profile retrieved', { user });
        } catch (error) {
            sendResponse(res, 500, false, error.message);
        }
    }
}

export default new AuthController();
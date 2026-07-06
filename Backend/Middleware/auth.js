import jwt from 'jsonwebtoken';
import { sendResponse } from '../Utils/responseHandler.js';

const SECRET_KEY = process.env.JWT_SECRET || 'paketexpress2026#';

export const authPage = (req, res, next) => {
    const token = req.cookies?.token;
    
    if (!token) {
        return res.redirect('/login');
    }
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
};

export const authApi = (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return sendResponse(res, 401, false, 'Belum login');
    }
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return sendResponse(res, 403, false, 'Token tidak valid atau kadaluarsa');
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return sendResponse(res, 403, false, 'Akses hanya untuk admin');
    }
    next();
};
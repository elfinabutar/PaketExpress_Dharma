import { BaseModel } from './BaseModel.js';
import bcrypt from 'bcrypt';

export class User extends BaseModel {
    constructor(db) {
        super('users', db);
    }

    async register(userData) {
        try {
            const { nama, email, password, no_telepon, alamat } = userData;
            
            const existingUser = await this.findByEmail(email);
            if (existingUser) {
                throw new Error('Email sudah terdaftar');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            
            const newUser = await this.create({
                nama,
                email,
                password: hashedPassword,
                no_telepon: no_telepon || null,
                alamat: alamat || null,
                role: 'customer'
            });
            
            delete newUser.password;
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    async login(email, password) {
        try {
            const user = await this.findByEmail(email);
            if (!user) {
                throw new Error('Email tidak ditemukan');
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error('Password salah');
            }

            delete user.password;
            return user;
        } catch (error) {
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            const [rows] = await this.db.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error finding user: ${error.message}`);
        }
    }

    async getUserPackets(userId) {
        try {
            const [rows] = await this.db.query(
                `SELECT p.*, t.kota_asal, t.kota_tujuan, t.estimasi_hari,
                        tr.status as tracking_status, tr.lokasi, tr.created_at as tracking_time
                 FROM paket p
                 JOIN tarif t ON p.idtarif = t.idtarif
                 LEFT JOIN tracking tr ON p.idpaket = tr.idpaket
                 WHERE p.user_id = ?
                 ORDER BY p.created_at DESC`,
                [userId]
            );
            return rows;
        } catch (error) {
            throw new Error(`Error getting user packets: ${error.message}`);
        }
    }
}
import express from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

import db from "./Backend/Config/db.js";
import { getAllTarif, getKotaList, createPaket, getAllPaket, getPaketById, lacakPaket, updateStatus } from "./Backend/paket.js";

const app = express();
const SECRET = process.env.SECRET || "paketexpress2026#";

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));

// Debug: Cek file dashboard.html
const dashboardPath = path.join(process.cwd(), 'public', 'dashboard.html');
console.log('\n📁 Cek file dashboard.html:');
console.log('   Path:', dashboardPath);
console.log('   Ada?', fs.existsSync(dashboardPath) ? '✅ YA' : '❌ TIDAK');

function authPage(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return res.redirect('/login');
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.clearCookie("token");
        res.redirect('/login');
    }
}

function authApi(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Belum login" });
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.status(403).json({ success: false, message: "Token tidak valid" });
    }
}

// HTML Routes
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'login.html')));
app.get('/daftar', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'daftar.html')));
app.get('/lupa', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'lupa.html')));
app.get('/dashboard', authPage, (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'dashboard.html')));
app.get('/kirim', authPage, (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'kirim.html')));
app.get('/lacak', authPage, (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'lacak.html')));
app.get('/tarif', authPage, (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'tarif.html')));
app.get('/riwayat', authPage, (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'riwayat.html')));
app.get('/profile', authPage, (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'profile.html')));

// Auth API
app.post("/register", async (req, res) => {
    try {
        const { nama, email, password, no_telepon, alamat } = req.body;
        if (!nama || !email || !password) return res.status(400).json({ success: false, message: "Semua field wajib diisi" });
        
        const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length > 0) return res.status(409).json({ success: false, message: "Email sudah terdaftar" });
        
        const hashed = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (nama, email, password, no_telepon, alamat) VALUES (?, ?, ?, ?, ?)", [nama, email, hashed, no_telepon || null, alamat || null]);
        res.json({ success: true, message: "Registrasi berhasil! Silakan login." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: "Email dan password wajib diisi" });
        
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = rows[0];
        if (!user) return res.status(401).json({ success: false, message: "Email tidak ditemukan" });
        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ success: false, message: "Password salah" });
        
        const token = jwt.sign({ id: user.idusers, nama: user.nama, email: user.email }, SECRET, { expiresIn: "7d" });
        res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ success: true, message: "Login berhasil!", nama: user.nama, token });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true, message: "Logout berhasil" });
});

app.get("/profile", authApi, async (req, res) => {
    try {
        const [rows] = await db.query("SELECT idusers, nama, email, no_telepon, alamat FROM users WHERE idusers = ?", [req.user.id]);
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put("/profile", authApi, async (req, res) => {
    try {
        await db.query("UPDATE users SET no_telepon = ?, alamat = ? WHERE idusers = ?", [req.body.no_telepon, req.body.alamat, req.user.id]);
        res.json({ success: true, message: "Profile berhasil diupdate" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Paket API
app.get("/tarif", authApi, getAllTarif);
app.get("/kota", authApi, getKotaList);
app.post("/paket", authApi, createPaket);
app.get("/paket", authApi, getAllPaket);
app.get("/paket/:id", authApi, getPaketById);
app.get("/lacak/:no_resi", authApi, lacakPaket);
app.put("/paket/:id/status", authApi, updateStatus);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n✅ Server running at http://localhost:${PORT}`);
    console.log(`🔐 Login: http://localhost:${PORT}/login\n`);
});
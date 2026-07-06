import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import http from 'http';
import WebSocket from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Import configs
import env from './Backend/Config/environment.js';
import db from './Backend/Config/db.js';

// Import middleware
import { authPage, authApi } from './Backend/Middleware/auth.js';
import { validateEmail, validatePassword } from './Backend/Middleware/validation.js';
import { errorHandler, notFoundHandler } from './Backend/Middleware/errorHandler.js';

// Import routes
import authRoutes from './Backend/Routes/authRoutes.js';
import userRoutes from './Backend/Routes/userRoutes.js';
import paketRoutes from './Backend/Routes/paketRoutes.js';
import tarifRoutes from './Backend/Routes/tarifRoutes.js';

// Import logger
import { logger } from './Backend/Utils/logger.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// ========== MIDDLEWARE ==========
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));

// Logger middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// ========== WEBSOCKET SETUP (Real-Time Communication) ==========
const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    logger.info('Client WebSocket terhubung');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            // Broadcast ke semua client
            clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'update',
                        timestamp: new Date(),
                        data: data
                    }));
                }
            });
        } catch (err) {
            logger.error('WebSocket error', err.message);
        }
    });
    
    ws.on('close', () => {
        clients.delete(ws);
        logger.info('Client WebSocket terputus');
    });
});

// ========== HTML ROUTES (Page Views) ==========
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'login.html')));
app.get('/daftar', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'daftar.html')));
app.get('/lupa', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'lupa.html')));
app.get('/dashboard', authPage, (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'dashbord.html')));
app.get('/kirim', authPage, (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'kirim.html')));
app.get('/lacak', authPage, (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'lacak.html')));
app.get('/tarif', authPage, (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'tarif.html')));
app.get('/riwayat', authPage, (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'riwayat.html')));
app.get('/profile', authPage, (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'profile.html')));

// ========== API ROUTES ==========
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/paket', paketRoutes);
app.use('/api/tarif', tarifRoutes);

// ========== ERROR HANDLING ==========
app.use(notFoundHandler);
app.use(errorHandler);

// ========== SERVER START ==========
const PORT = env.PORT || 3000;

server.listen(PORT, () => {
    logger.info(`✅ Server running at http://localhost:${PORT}`);
    logger.info(`🔐 Login: http://localhost:${PORT}/login`);
    logger.info(`📊 WebSocket: ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.warn('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

export default app;

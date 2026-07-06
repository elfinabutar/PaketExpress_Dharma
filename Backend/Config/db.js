import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'paket_express',
    port: parseInt(process.env.DB_PORT) || 3306
});

// Test koneksi
try {
    const conn = await db.getConnection();
    console.log('✅ Database connected:', process.env.DB_NAME);
    conn.release();
} catch (err) {
    console.error('❌ Database error:', err.message);
}

export default db;
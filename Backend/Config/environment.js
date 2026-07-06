import dotenv from 'dotenv';

dotenv.config();

const env = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'paket_express',
    DB_PORT: process.env.DB_PORT || 3306,
    SECRET: process.env.SECRET || 'paketexpress2026#',
    JWT_EXPIRES: process.env.JWT_EXPIRES || '7d'
};

export default env;

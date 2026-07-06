import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');

// Buat folder logs jika belum ada
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const getTimestamp = () => new Date().toISOString();

export const logger = {
    info: (message) => {
        const log = `[${getTimestamp()}] INFO: ${message}`;
        console.log(log);
        fs.appendFileSync(path.join(logsDir, 'app.log'), log + '\n');
    },
    error: (message, error) => {
        const log = `[${getTimestamp()}] ERROR: ${message} - ${error}`;
        console.error(log);
        fs.appendFileSync(path.join(logsDir, 'error.log'), log + '\n');
    },
    warn: (message) => {
        const log = `[${getTimestamp()}] WARN: ${message}`;
        console.warn(log);
        fs.appendFileSync(path.join(logsDir, 'app.log'), log + '\n');
    }
};

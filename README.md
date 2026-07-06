# 📦 PaketExpress - Sistem Manajemen Pengiriman Paket

## 📋 Deskripsi Proyek

PaketExpress adalah aplikasi web untuk mengelola pengiriman paket dengan fitur tracking real-time. Aplikasi ini dibangun menggunakan:
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Frontend**: HTML5 + CSS3 + JavaScript
- **Real-time**: WebSocket untuk tracking paket
- **Authentication**: JWT (JSON Web Tokens)

## ✅ Indikator Penilaian UAS

### 1. **Integrasi Database (15%)**
- ✅ MySQL database dengan struktur yang baik
- ✅ Connection pooling untuk performa optimal
- ✅ Query prepared statements untuk keamanan
- ✅ File: `Backend/Config/db.js`

### 2. **Implementasi Middleware (10%)**
- ✅ Authentication middleware (authPage, authApi)
- ✅ Validation middleware (email, password, required fields)
- ✅ Error handling middleware
- ✅ Files: `Backend/Middleware/`

### 3. **REST API Implementation (10%)**
- ✅ RESTful endpoints untuk semua fitur
- ✅ Proper HTTP methods (GET, POST, PUT, DELETE)
- ✅ Status codes yang sesuai
- ✅ Request/response yang terstruktur
- ✅ Files: `Backend/Routes/`

### 4. **Autentikasi & Otorisasi (15%)**
- ✅ User registration dengan password hashing (bcrypt)
- ✅ User login dengan JWT token
- ✅ Role-based access control
- ✅ Protected routes dan API endpoints
- ✅ Cookie-based session management
- ✅ File: `Backend/Controllers/authController.js`

### 5. **UI/UX Design (20%)**
- ✅ Responsive design untuk semua device
- ✅ Modern dan menarik interface
- ✅ Easy navigation
- ✅ Loading indicators dan error messages
- ✅ Files: `public/` (HTML pages)

### 6. **Real-Time Communication & Hosting (20%)**
- ✅ WebSocket untuk live tracking paket
- ✅ Real-time status updates
- ✅ Broadcasting ke multiple clients
- ✅ Ready untuk deployment
- ✅ File: `index.js` (WebSocket implementation)

### 7. **Self-Learned Technology (10%)**
- ✅ WebSocket untuk real-time features
- ✅ JWT untuk authentication
- ✅ Bcrypt untuk password security
- ✅ Connection pooling untuk database

## 🏗️ Struktur Proyek

```
PaketExpress_Dharma/
├── Backend/
│   ├── Config/
│   │   ├── db.js                 (Database connection)
│   │   └── environment.js        (Environment variables)
│   ├── Middleware/
│   │   ├── auth.js               (Authentication & Authorization)
│   │   ├── validation.js         (Input validation)
│   │   └── errorHandler.js       (Error handling)
│   ├── Controllers/
│   │   ├── authController.js     (Auth logic)
│   │   ├── userController.js     (User management)
│   │   ├── paketController.js    (Package management)
│   │   └── tarifController.js    (Tariff management)
│   ├── Routes/
│   │   ├── authRoutes.js         (Auth endpoints)
│   │   ├── userRoutes.js         (User endpoints)
│   │   ├── paketRoutes.js        (Package endpoints)
│   │   └── tarifRoutes.js        (Tariff endpoints)
│   ├── Utils/
│   │   ├── logger.js             (Logging utility)
│   │   └── helpers.js            (Helper functions)
│   └── Model/
│       └���─ (Database models)
├── public/
│   ├── login.html                (Login page)
│   ├── daftar.html               (Registration page)
│   ├── dashbord.html             (Dashboard)
│   ├── kirim.html                (Send package)
│   ├── lacak.html                (Track package)
│   ├── tarif.html                (Tariff info)
│   ├── riwayat.html              (History)
│   ├── profile.html              (User profile)
│   ├── assets/                   (Images, CSS, JS)
│   └── lupa.html                 (Forgot password)
├── logs/                         (Application logs)
├── index.js                      (Main server file)
├── package.json                  (Dependencies)
├── .env                          (Environment variables)
└── README.md                     (This file)
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js v14 atau lebih tinggi
- MySQL v5.7 atau lebih tinggi
- npm atau yarn

### 1. Clone Repository
```bash
git clone https://github.com/elfinabutar/PaketExpress_Dharma.git
cd PaketExpress_Dharma
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
```bash
# Buat database MySQL
CREATE DATABASE paket_express;
USE paket_express;

# Import schema (create tables)
-- Users table
CREATE TABLE users (
    idusers INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    no_telepon VARCHAR(20),
    alamat TEXT,
    role ENUM('customer', 'admin', 'courier') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Packages table
CREATE TABLE paket (
    idpaket INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    no_resi VARCHAR(50) UNIQUE NOT NULL,
    nama_pengirim VARCHAR(100) NOT NULL,
    alamat_pengirim TEXT NOT NULL,
    nama_penerima VARCHAR(100) NOT NULL,
    alamat_penerima TEXT NOT NULL,
    berat DECIMAL(10, 2) NOT NULL,
    tarif DECIMAL(15, 2),
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(idusers) ON DELETE CASCADE
);

-- Package status history
CREATE TABLE status_paket (
    idstatus INT PRIMARY KEY AUTO_INCREMENT,
    paket_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paket_id) REFERENCES paket(idpaket) ON DELETE CASCADE
);

-- Tariff table
CREATE TABLE tarif (
    idtarif INT PRIMARY KEY AUTO_INCREMENT,
    berat_awal DECIMAL(10, 2) NOT NULL,
    berat_akhir DECIMAL(10, 2) NOT NULL,
    harga DECIMAL(15, 2) NOT NULL,
    keterangan VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cities table
CREATE TABLE kota (
    idkota INT PRIMARY KEY AUTO_INCREMENT,
    nama_kota VARCHAR(100) NOT NULL UNIQUE,
    provinsi VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Setup Environment Variables
Buat file `.env`:
```env
# Database Configuration
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=dharma1809!
DB_NAME=paket_express
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
SECRET=paketexpress2026#
JWT_EXPIRES=7d
```

### 5. Run Application
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Server akan berjalan di: `http://localhost:3000`

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Management
- `GET /api/users/profile` - Dapatkan profil user
- `PUT /api/users/profile` - Update profil user
- `PUT /api/users/change-password` - Ubah password

### Package Management
- `GET /api/paket` - Dapatkan semua paket
- `POST /api/paket` - Buat paket baru
- `GET /api/paket/:id` - Dapatkan detail paket
- `GET /api/paket/lacak/:no_resi` - Lacak paket
- `PUT /api/paket/:id/status` - Update status paket

### Tariff Management
- `GET /api/tarif` - Dapatkan semua tarif
- `POST /api/tarif/hitung` - Hitung tarif berdasarkan berat
- `GET /api/tarif/kota` - Dapatkan daftar kota

## 🔐 Security Features

1. **Password Hashing**: Menggunakan bcrypt dengan salt rounds 10
2. **JWT Authentication**: Token-based authentication dengan expiry
3. **SQL Injection Prevention**: Prepared statements di semua queries
4. **CORS Protection**: Configured CORS untuk API security
5. **HTTP Only Cookies**: Cookies tidak bisa diakses JavaScript
6. **Role-Based Access**: Authorization middleware untuk kontrol akses

## 🔄 Real-Time Features

WebSocket untuk real-time tracking:
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Real-time update:', data);
};
```

## 📊 Database Schema

### Users Table
- idusers (INT, PK)
- nama (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR)
- no_telepon (VARCHAR)
- alamat (TEXT)
- role (ENUM)
- timestamps

### Packages Table
- idpaket (INT, PK)
- user_id (INT, FK)
- no_resi (VARCHAR, UNIQUE)
- nama_pengirim, alamat_pengirim
- nama_penerima, alamat_penerima
- berat, tarif
- status (ENUM)
- timestamps

## 🧪 Testing API

Gunakan Postman atau curl:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nama":"John","email":"john@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}'

# Get Profile
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Logging

Log files tersimpan di folder `logs/`:
- `app.log` - Application logs
- `error.log` - Error logs

## 🚢 Deployment

### Untuk production:
1. Update `.env` dengan production values
2. Set `NODE_ENV=production`
3. Setup SSL certificate
4. Deploy ke hosting (Heroku, DigitalOcean, AWS, dll)

## 👥 Team Members

Kelas Dharma UAS Project

## 📄 License

MIT License

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di GitHub.

---

**Last Updated**: 2026-07-06
**Status**: ✅ Ready for Production

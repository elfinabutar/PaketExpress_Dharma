# Database Schema dan Query untuk PaketExpress

## 1. Users Table
```sql
CREATE TABLE users (
    idusers INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    no_telepon VARCHAR(20),
    alamat TEXT,
    role ENUM('customer', 'admin', 'courier') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);
```

## 2. Packages Table
```sql
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
    FOREIGN KEY (user_id) REFERENCES users(idusers) ON DELETE CASCADE,
    INDEX idx_no_resi (no_resi),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);
```

## 3. Package Status History Table
```sql
CREATE TABLE status_paket (
    idstatus INT PRIMARY KEY AUTO_INCREMENT,
    paket_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    keterangan TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paket_id) REFERENCES paket(idpaket) ON DELETE CASCADE,
    INDEX idx_paket_id (paket_id),
    INDEX idx_created_at (created_at)
);
```

## 4. Tariff Table
```sql
CREATE TABLE tarif (
    idtarif INT PRIMARY KEY AUTO_INCREMENT,
    berat_awal DECIMAL(10, 2) NOT NULL,
    berat_akhir DECIMAL(10, 2) NOT NULL,
    harga DECIMAL(15, 2) NOT NULL,
    keterangan VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_berat (berat_awal, berat_akhir)
);
```

## 5. Cities Table
```sql
CREATE TABLE kota (
    idkota INT PRIMARY KEY AUTO_INCREMENT,
    nama_kota VARCHAR(100) NOT NULL UNIQUE,
    provinsi VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nama_kota (nama_kota)
);
```

## Sample Data

### Insert Users
```sql
INSERT INTO users (nama, email, password, no_telepon, alamat, role) VALUES
('Admin', 'admin@paketexpress.com', '$2b$10$...', '081234567890', 'Jakarta', 'admin'),
('Courier', 'kurir@paketexpress.com', '$2b$10$...', '082345678901', 'Jakarta', 'courier'),
('Customer', 'customer@paketexpress.com', '$2b$10$...', '083456789012', 'Bandung', 'customer');
```

### Insert Tariff
```sql
INSERT INTO tarif (berat_awal, berat_akhir, harga, keterangan) VALUES
(0, 1, 15000, 'Paket hingga 1 kg'),
(1, 2, 20000, 'Paket 1-2 kg'),
(2, 5, 30000, 'Paket 2-5 kg'),
(5, 10, 50000, 'Paket 5-10 kg'),
(10, 20, 80000, 'Paket 10-20 kg');
```

### Insert Cities
```sql
INSERT INTO kota (nama_kota, provinsi) VALUES
('Jakarta', 'DKI Jakarta'),
('Bandung', 'Jawa Barat'),
('Surabaya', 'Jawa Timur'),
('Medan', 'Sumatera Utara'),
('Yogyakarta', 'Daerah Istimewa Yogyakarta');
```

## Common Queries

### Get All Packages with User Info
```sql
SELECT p.*, u.nama as pengirim 
FROM paket p 
LEFT JOIN users u ON p.user_id = u.idusers 
ORDER BY p.created_at DESC;
```

### Get Package Tracking History
```sql
SELECT p.*, sp.status, sp.keterangan, sp.created_at
FROM paket p
LEFT JOIN status_paket sp ON p.idpaket = sp.paket_id
WHERE p.no_resi = 'PE...' 
ORDER BY sp.created_at DESC;
```

### Calculate Revenue by Date
```sql
SELECT DATE(p.created_at) as tanggal, COUNT(*) as jumlah, SUM(p.tarif) as total
FROM paket p
WHERE p.status = 'delivered'
GROUP BY DATE(p.created_at)
ORDER BY tanggal DESC;
```

### Get User Statistics
```sql
SELECT 
    u.nama,
    COUNT(p.idpaket) as jumlah_paket,
    SUM(p.tarif) as total_biaya,
    MAX(p.created_at) as paket_terakhir
FROM users u
LEFT JOIN paket p ON u.idusers = p.user_id
GROUP BY u.idusers;
```

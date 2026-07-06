# API Documentation - PaketExpress

## Base URL
```
http://localhost:3000/api
```

## Authentication
Semua endpoint (kecuali register dan login) memerlukan JWT token di header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📝 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "nama": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "no_telepon": "081234567890",
  "alamat": "Jl. Merdeka No. 1"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Silakan login."
}
```

---

### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil!",
  "data": {
    "id": 1,
    "nama": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Logout User
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

## 👤 User Management Endpoints

### 1. Get User Profile
**GET** `/users/profile`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "idusers": 1,
    "nama": "John Doe",
    "email": "john@example.com",
    "no_telepon": "081234567890",
    "alamat": "Jl. Merdeka No. 1",
    "role": "customer",
    "created_at": "2026-07-06T10:00:00Z"
  }
}
```

---

### 2. Update User Profile
**PUT** `/users/profile`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "nama": "John Updated",
  "no_telepon": "082345678901",
  "alamat": "Jl. Gatot Subroto No. 5"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profil berhasil diperbarui"
}
```

---

### 3. Change Password
**PUT** `/users/change-password`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password berhasil diubah"
}
```

---

## 📦 Package Management Endpoints

### 1. Get All Packages
**GET** `/paket`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, processing, shipped, delivered, cancelled)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "idpaket": 1,
      "no_resi": "PE1625574000001",
      "nama_pengirim": "John Doe",
      "alamat_pengirim": "Jakarta",
      "nama_penerima": "Jane Doe",
      "alamat_penerima": "Bandung",
      "berat": 2.5,
      "tarif": 25000,
      "status": "processing",
      "pengirim": "John Doe",
      "created_at": "2026-07-06T10:00:00Z"
    }
  ]
}
```

---

### 2. Create New Package
**POST** `/paket`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "no_resi": "PE1625574000001",
  "nama_pengirim": "John Doe",
  "alamat_pengirim": "Jakarta Pusat",
  "nama_penerima": "Jane Doe",
  "alamat_penerima": "Bandung",
  "berat": 2.5,
  "tarif": 25000
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Paket berhasil dibuat",
  "data": {
    "idpaket": 1,
    "no_resi": "PE1625574000001"
  }
}
```

---

### 3. Get Package by ID
**GET** `/paket/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "idpaket": 1,
    "no_resi": "PE1625574000001",
    "nama_pengirim": "John Doe",
    "alamat_pengirim": "Jakarta Pusat",
    "nama_penerima": "Jane Doe",
    "alamat_penerima": "Bandung",
    "berat": 2.5,
    "tarif": 25000,
    "status": "processing",
    "pengirim": "John Doe"
  }
}
```

---

### 4. Track Package
**GET** `/paket/lacak/:no_resi`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "idpaket": 1,
    "no_resi": "PE1625574000001",
    "status": "processing",
    "riwayat_status": [
      {
        "status": "pending",
        "waktu": "2026-07-06T10:00:00Z"
      },
      {
        "status": "processing",
        "waktu": "2026-07-06T11:00:00Z"
      }
    ]
  }
}
```

---

### 5. Update Package Status
**PUT** `/paket/:id/status`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Status paket berhasil diperbarui"
}
```

---

## 💰 Tariff Management Endpoints

### 1. Get All Tariffs
**GET** `/tarif`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "idtarif": 1,
      "berat_awal": 0,
      "berat_akhir": 1,
      "harga": 15000,
      "keterangan": "Paket hingga 1 kg"
    },
    {
      "idtarif": 2,
      "berat_awal": 1,
      "berat_akhir": 2,
      "harga": 20000,
      "keterangan": "Paket 1-2 kg"
    }
  ]
}
```

---

### 2. Calculate Tariff
**POST** `/tarif/hitung`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "berat": 2.5
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "berat": 2.5,
    "harga": 25000,
    "keterangan": "Paket 2-5 kg"
  }
}
```

---

### 3. Get Cities List
**GET** `/tarif/kota`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    "Jakarta",
    "Bandung",
    "Surabaya",
    "Medan",
    "Yogyakarta"
  ]
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Semua field wajib diisi"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token tidak ditemukan. Silakan login terlebih dahulu."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Token tidak valid atau sudah kadaluarsa"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Paket tidak ditemukan"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Terjadi kesalahan pada server"
}
```

---

## 🔄 WebSocket Real-Time Updates

### Connect to WebSocket
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
    console.log('Connected to WebSocket');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Real-time update:', data);
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

ws.onclose = () => {
    console.log('Disconnected from WebSocket');
};
```

### Send Message
```javascript
ws.send(JSON.stringify({
    type: 'status-update',
    paket_id: 1,
    status: 'shipped'
}));
```

### Receive Message
```json
{
  "type": "update",
  "timestamp": "2026-07-06T12:00:00Z",
  "data": {
    "paket_id": 1,
    "status": "shipped"
  }
}
```

---

**Last Updated**: 2026-07-06

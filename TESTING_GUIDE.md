# Testing Guide - PaketExpress

## Unit Testing Setup

### Install Testing Dependencies
```bash
npm install --save-dev jest supertest
```

### Configure Jest
Create `jest.config.js`:
```javascript
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.js'],
    collectCoverageFrom: [
        'Backend/**/*.js',
        '!Backend/Config/**'
    ]
};
```

## API Testing with Postman

### 1. Create Postman Collection

#### Setup Environment Variables
```json
{
    "base_url": "http://localhost:3000",
    "token": "",
    "user_id": 1
}
```

### 2. Test Scenarios

#### Authentication Tests
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

#### User Tests
```
GET /api/users/profile
PUT /api/users/profile
PUT /api/users/change-password
```

#### Package Tests
```
GET /api/paket
POST /api/paket
GET /api/paket/:id
GET /api/paket/lacak/:no_resi
PUT /api/paket/:id/status
```

#### Tariff Tests
```
GET /api/tarif
POST /api/tarif/hitung
GET /api/tarif/kota
```

## Automated Testing

### Backend Tests

**File: `Backend/Controllers/authController.test.js`**
```javascript
const request = require('supertest');
const app = require('../../index');

describe('Auth Controller', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    nama: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
        });

        it('should fail with duplicate email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    nama: 'Test User',
                    email: 'existing@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(409);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
        });
    });
});
```

### Run Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- authController.test.js

# Watch mode
npm test -- --watch
```

## Frontend Testing

### Manual Testing Checklist

#### Login Page
- [ ] Dapat memasukkan email dan password
- [ ] Validasi email format
- [ ] Password visibility toggle
- [ ] Error message muncul untuk email tidak terdaftar
- [ ] Error message muncul untuk password salah
- [ ] Loading spinner muncul saat login
- [ ] Redirect ke dashboard setelah login berhasil

#### Register Page
- [ ] Dapat memasukkan data lengkap
- [ ] Validasi password minimal 6 karakter
- [ ] Validasi email format
- [ ] Error message untuk email sudah terdaftar
- [ ] Success message dan redirect ke login

#### Dashboard
- [ ] Nama user ditampilkan dengan benar
- [ ] Menu navigasi berfungsi
- [ ] Logout berfungsi
- [ ] Quick action buttons berfungsi

#### Send Package Page
- [ ] Form input berfungsi
- [ ] Weight change memicu tariff calculation
- [ ] Tariff ditampilkan dengan benar
- [ ] Form submit berhasil
- [ ] No. Resi ditampilkan

#### Track Package Page
- [ ] Search dengan no. resi berfungsi
- [ ] Tracking timeline ditampilkan
- [ ] Status history muncul dengan benar

#### Profile Page
- [ ] Data user dimuat dengan benar
- [ ] Dapat mengupdate profil
- [ ] Password field terenkripsi
- [ ] Success message muncul

## Performance Testing

### Load Testing dengan Apache Bench
```bash
# Install
apt-get install apache2-utils

# Test
ab -n 1000 -c 10 http://localhost:3000/api/tarif

# Results akan menunjukkan requests/second
```

### Response Time Testing
```bash
# Measure response time
time curl http://localhost:3000/api/paket

# Should be < 500ms untuk optimal performance
```

## Security Testing

### SQL Injection Test
```bash
# Try SQL injection
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin\' OR \'1\'=\'1", "password":"anything"}'

# Should fail - application is protected
```

### XSS Test
```bash
# Try XSS attack
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nama":"<script>alert(\'XSS\')</script>", "email":"test@test.com", "password":"123456"}'

# Should sanitize input
```

## Browser Compatibility Testing

Test di browsers berikut:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design Testing

### Test di ukuran layar berikut:
- [ ] Mobile: 320px
- [ ] Tablet: 768px
- [ ] Desktop: 1024px+
- [ ] Large Desktop: 1440px+

---

**Last Updated**: 2026-07-06

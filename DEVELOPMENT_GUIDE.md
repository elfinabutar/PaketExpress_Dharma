# Development Guide - PaketExpress

## 🛠️ Development Setup

### Tools Required
- VS Code atau IDE lainnya
- Node.js v14+
- MySQL 5.7+
- Postman (untuk testing API)
- Git

### Install Dev Dependencies
```bash
npm install --save-dev nodemon
```

## 📂 Project Structure

```
Backend/
├── Config/           # Konfigurasi aplikasi
├── Middleware/       # Express middleware
├── Controllers/      # Business logic
├── Routes/          # API routes
├── Utils/           # Helper functions
└── Model/           # Database models (jika ada)
```

## 🔄 Development Workflow

### 1. Menambah Endpoint Baru

**Step 1: Buat Controller** (`Backend/Controllers/namaController.js`)
```javascript
export const namaFunction = async (req, res, next) => {
    try {
        // Logic di sini
        res.json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
```

**Step 2: Buat Route** (`Backend/Routes/namaRoutes.js`)
```javascript
import express from 'express';
import { namaFunction } from '../Controllers/namaController.js';
import { authApi } from '../Middleware/auth.js';

const router = express.Router();

router.get('/', authApi, namaFunction);

export default router;
```

**Step 3: Register di Main App** (`index.js`)
```javascript
import namaRoutes from './Backend/Routes/namaRoutes.js';

app.use('/api/nama', namaRoutes);
```

### 2. Menambah Middleware

**File: `Backend/Middleware/namaMiddleware.js`**
```javascript
export const namaMiddleware = (req, res, next) => {
    // Logic di sini
    next();
};
```

**Gunakan di Route:**
```javascript
router.get('/', namaMiddleware, controller);
```

## 🧪 Testing

### Dengan Postman
1. Import collection dari `postman_collection.json`
2. Set environment variables
3. Run tests

### Dengan curl
```bash
# POST Request
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# GET Request with Token
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Debugging

### Enable Debug Logging
```javascript
const debug = require('debug')('app:*');
```

### Check Database
```bash
mysql -u root -p paket_express
SHOW TABLES;
SELECT * FROM users;
```

## 📝 Coding Standards

### File Naming
- Controllers: camelCase + Controller suffix (`userController.js`)
- Routes: camelCase + Routes suffix (`userRoutes.js`)
- Middleware: camelCase (`auth.js`, `validation.js`)

### Variable Naming
```javascript
// ✅ Good
const userData = {};
const getUserProfile = async () => {};

// ❌ Bad
const data = {};
const get = async () => {};
```

### Error Handling
```javascript
try {
    // logic
} catch (err) {
    logger.error('Function name', err.message);
    next(err);
}
```

### Async/Await Pattern
```javascript
export const functionName = async (req, res, next) => {
    try {
        const data = await db.query('SELECT * FROM table');
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};
```

## 🔐 Security Best Practices

1. **Never commit .env file**
   ```bash
   echo ".env" >> .gitignore
   ```

2. **Use environment variables for sensitive data**
   ```javascript
   const secret = process.env.JWT_SECRET;
   ```

3. **Validate user input**
   ```javascript
   const { email, password } = req.body;
   if (!email || !password) return res.status(400).json({...});
   ```

4. **Hash passwords**
   ```javascript
   const hashed = await bcrypt.hash(password, 10);
   ```

5. **Use HTTPS in production**
   ```javascript
   secure: process.env.NODE_ENV === 'production'
   ```

## 📊 Database Migration

### Backup Database
```bash
mysqldump -u root -p paket_express > backup.sql
```

### Restore Database
```bash
mysql -u root -p paket_express < backup.sql
```

## 🚀 Deployment Checklist

- [ ] Update `.env` untuk production
- [ ] Set `NODE_ENV=production`
- [ ] Setup SSL certificate
- [ ] Configure database untuk production
- [ ] Setup monitoring/logging
- [ ] Test semua endpoints
- [ ] Setup backup strategy
- [ ] Configure firewall rules
- [ ] Setup reverse proxy (nginx/apache)
- [ ] Enable GZIP compression

## 📚 Useful Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Check Node version
node -v

# Install dependencies
npm install

# Update dependencies
npm update

# List installed packages
npm list
```

## 🔗 Useful Links

- [Express.js Documentation](https://expressjs.com/)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
- [JWT Documentation](https://jwt.io/)
- [bcrypt Documentation](https://github.com/dcodeIO/bcrypt.js)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

---

**Last Updated**: 2026-07-06

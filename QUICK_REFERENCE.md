# Quick Reference - PaketExpress

## 🚀 Quick Start

```bash
# 1. Setup
bash setup.sh

# 2. Update .env dengan database credentials

# 3. Create database
mysql -u root -p < DATABASE_SCHEMA.md

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

## 📁 Project Structure

```
Backend/
  ├── Config/              # Database & environment config
  ├── Middleware/          # Auth, validation, error handling
  ├── Controllers/         # Business logic
  ├── Routes/              # API endpoints
  ├── Utils/               # Helper functions & logging
  └── Model/               # Database models

public/                    # Frontend HTML pages
index.js                   # Main application file
package.json              # Dependencies
.env                      # Environment variables
```

## 🔌 API Endpoints Quick Reference

### Auth
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/logout        - Logout user
```

### Users
```
GET    /api/users/profile       - Get profile
PUT    /api/users/profile       - Update profile
PUT    /api/users/change-password - Change password
```

### Packages
```
GET    /api/paket               - Get all packages
POST   /api/paket               - Create package
GET    /api/paket/:id           - Get package by ID
GET    /api/paket/lacak/:no_resi - Track package
PUT    /api/paket/:id/status    - Update status
```

### Tariffs
```
GET    /api/tarif               - Get all tariffs
POST   /api/tarif/hitung        - Calculate tariff
GET    /api/tarif/kota          - Get cities list
```

## 🧪 Testing API

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nama":"John","email":"john@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}'

# Get Profile (replace TOKEN with your token)
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

## 📊 Database

### Create Database
```sql
CREATE DATABASE paket_express;
USE paket_express;
```

### Check Tables
```sql
SHOW TABLES;
DESC users;
DESC paket;
```

## 🛠️ Common Commands

```bash
# Start development
npm run dev

# Start production
npm start

# View logs
tail -f logs/app.log

# View errors
tail -f logs/error.log

# Check Node version
node -v

# Install dependencies
npm install

# Update dependencies
npm update
```

## 🔐 Security

- Never commit `.env` file
- Change `SECRET` in production
- Use HTTPS in production
- Keep dependencies updated
- Use strong passwords

## 📚 Documentation

- `README.md` - Project overview
- `API_DOCUMENTATION.md` - API reference
- `DATABASE_SCHEMA.md` - Database structure
- `DEVELOPMENT_GUIDE.md` - Dev standards
- `DEPLOYMENT_GUIDE.md` - Deploy instructions
- `TESTING_GUIDE.md` - Testing procedures
- `TROUBLESHOOTING.md` - Common issues

## 🚀 Deployment

```bash
# Heroku
git push heroku main

# DigitalOcean/AWS
# See DEPLOYMENT_GUIDE.md
```

## 📞 Support

1. Check documentation files
2. Review TROUBLESHOOTING.md
3. Check application logs
4. Create GitHub issue

---

**Last Updated**: 2026-07-06

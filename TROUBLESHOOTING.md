# Troubleshooting Guide

## Common Issues dan Solutions

### Database Issues

#### Error: ER_ACCESS_DENIED_FOR_USER
**Problem**: Tidak bisa connect ke database

**Solutions**:
1. Verifikasi credentials di `.env`
2. Pastikan MySQL server running:
   ```bash
   sudo service mysql status
   sudo service mysql start
   ```
3. Check user permissions:
   ```sql
   SELECT user, host FROM mysql.user WHERE user='paket_user';
   ```

#### Error: ER_NO_REFERENCED_ROW
**Problem**: Foreign key constraint violation

**Solution**: Pastikan parent record sudah ada sebelum insert child record

#### Error: Connection Pool Limit
**Problem**: Too many connections

**Solution**: Increase connection limit di `Backend/Config/db.js`:
```javascript
const pool = mysql.createPool({
    connectionLimit: 20,  // increase dari 10
    queueLimit: 5
});
```

---

### Authentication Issues

#### Error: "Token not found"
**Problem**: API request tanpa token

**Solution**: Tambahkan Authorization header:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/users/profile
```

#### Error: "Token tidak valid"
**Problem**: Token expired atau corrupted

**Solution**: 
1. Login ulang untuk dapatkan token baru
2. Check `JWT_EXPIRES` di `.env`
3. Verify SECRET key match antara server dan client

#### Error: "Email sudah terdaftar"
**Problem**: Trying to register dengan email yang sudah ada

**Solution**: Gunakan email yang berbeda atau login jika sudah punya akun

---

### Application Issues

#### Error: Cannot find module
**Problem**: Missing dependency

**Solution**:
```bash
npm install
npm install [missing-package]
```

#### Error: Port 3000 already in use
**Problem**: Port 3000 sudah digunakan aplikasi lain

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 PID

# Or gunakan port berbeda
PORT=3001 npm start
```

#### Error: Cannot GET /dashboard
**Problem**: File HTML tidak ditemukan

**Solution**: Check file ada di `public/dashbord.html` (atau `dashboard.html`)

---

### Frontend Issues

#### Form tidak submit
**Problem**: JavaScript error atau network issue

**Solution**:
1. Buka Developer Tools (F12) → Console
2. Check untuk JavaScript errors
3. Check Network tab untuk failed requests
4. Verify endpoint URL match dengan backend

#### Login/Register gagal tapi tidak ada error message
**Problem**: API endpoint tidak accessible

**Solution**:
1. Check backend server running: `npm start`
2. Check CORS configuration di `index.js`
3. Check network tab di browser dev tools
4. Verify endpoint URL

#### Responsive design jelek di mobile
**Problem**: Viewport meta tag missing

**Solution**: Sudah included di HTML head:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

### WebSocket Issues

#### WebSocket connection failed
**Problem**: WebSocket tidak connect

**Solution**:
1. Check WebSocket server running di index.js
2. Verify port match (default 3000)
3. Check firewall tidak block WebSocket
4. Try reload page

#### Real-time updates tidak muncul
**Problem**: WebSocket connected tapi no messages

**Solution**:
1. Check browser console untuk errors
2. Verify server sending messages
3. Check message format sesuai client listener

---

### Deployment Issues

#### 502 Bad Gateway
**Problem**: Nginx tidak bisa reach backend

**Solution**:
1. Verify backend running: `pm2 status`
2. Check backend listening on correct port
3. Verify nginx proxy_pass config
4. Check firewall rules

#### SSL Certificate Error
**Problem**: HTTPS tidak work

**Solution**:
```bash
# Renew certificate
certbot renew --force-renewal

# Check certificate
ssl-cert-check -c /etc/letsencrypt/live/domain.com/cert.pem
```

#### High Memory Usage
**Problem**: Application memory leak

**Solution**:
1. Check logs: `pm2 logs`
2. Look for unclosed connections
3. Restart app: `pm2 restart all`
4. Monitor: `pm2 monit`

---

### Development Workflow Issues

#### Changes tidak ter-reflect
**Problem**: Using npm start, changes require manual restart

**Solution**: Gunakan nodemon untuk auto-reload:
```bash
npm run dev
```

#### Git merge conflicts
**Problem**: Multiple developers editing same file

**Solution**:
1. Use branches untuk features
2. Pull latest sebelum push
3. Resolve conflicts dengan koordinasi team

#### Database data lost
**Problem**: Database reset unintentionally

**Solution**:
1. Backup database regularly
2. Use version control untuk schema changes
3. Test di development/staging dulu

---

### Performance Issues

#### Slow API response
**Problem**: API request lambat

**Solution**:
1. Check database indexes
2. Use EXPLAIN untuk analyze queries
3. Add appropriate indexes
4. Consider caching untuk frequent queries

#### High CPU usage
**Problem**: Server CPU 100%

**Solution**:
1. Check running processes
2. Optimize queries
3. Implement rate limiting
4. Use clustering untuk better resource usage

---

### Getting Help

1. **Check Documentation**
   - README.md
   - API_DOCUMENTATION.md
   - DEVELOPMENT_GUIDE.md

2. **Review Logs**
   ```bash
   # Application logs
   tail -f logs/app.log
   
   # Error logs
   tail -f logs/error.log
   
   # PM2 logs
   pm2 logs
   ```

3. **Debug Mode**
   - Enable debug logging
   - Check browser dev tools
   - Use Postman untuk test API

4. **Contact Support**
   - Create GitHub issue
   - Include error message
   - Include steps to reproduce
   - Include environment info

---

**Last Updated**: 2026-07-06

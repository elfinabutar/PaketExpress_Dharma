# Contributing Guide

## Cara Berkontribusi pada PaketExpress

### 1. Fork Repository
```bash
git clone https://github.com/YOUR_USERNAME/PaketExpress_Dharma.git
cd PaketExpress_Dharma
```

### 2. Buat Branch untuk Feature
```bash
git checkout -b feature/nama-fitur
# atau untuk bug fixes:
git checkout -b bugfix/nama-bug
```

### 3. Commit Changes
```bash
git add .
git commit -m "feat: deskripsi singkat perubahan"
```

### 4. Push ke Repository
```bash
git push origin feature/nama-fitur
```

### 5. Buat Pull Request
Buatlah PR dengan deskripsi yang jelas tentang perubahan yang dilakukan.

## Commit Message Convention

Gunakan format berikut:

```
<type>: <subject>

<body>

<footer>
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting)
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `test:` - Testing
- `chore:` - Maintenance

### Examples
```
feat: add real-time tracking with WebSocket
fix: resolve authentication token expiry issue
docs: update API documentation
```

## Code Standards

### JavaScript/Node.js
- Gunakan ES6+ syntax
- Gunakan async/await untuk async operations
- Gunakan const/let, hindari var
- Tambahkan JSDoc comments untuk functions

### Example Function
```javascript
/**
 * Get user by ID
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} User data
 * @throws {Error} If user not found
 */
export const getUserById = async (userId) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE idusers = ?', [userId]);
        if (!rows.length) throw new Error('User not found');
        return rows[0];
    } catch (err) {
        logger.error('getUserById', err.message);
        throw err;
    }
};
```

## Testing

### Sebelum Submit PR
1. Test semua endpoints dengan Postman
2. Check konsol browser untuk JavaScript errors
3. Verifikasi responsiveness di berbagai ukuran device
4. Test dengan different browser (Chrome, Firefox, Safari)

## Pull Request Checklist

- [ ] Code mengikuti style guide
- [ ] Tests telah dilakukan
- [ ] Documentation telah diupdate
- [ ] Tidak ada console errors
- [ ] Responsive design tested
- [ ] Security checks passed

---

**Terimakasih atas kontribusi Anda!**

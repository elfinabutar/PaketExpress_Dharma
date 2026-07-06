# PaketExpress - Deployment Guide

## 🚀 Deployment ke Production

### Prerequisites
- Hosting account (Heroku, DigitalOcean, AWS, etc.)
- Domain name
- SSL Certificate
- MySQL hosting or database service

## Deployment Options

### 1. Heroku Deployment

#### Setup
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create paketexpress-app
```

#### Configure Environment
```bash
heroku config:set DB_HOST=your_db_host
heroku config:set DB_USER=your_db_user
heroku config:set DB_PASSWORD=your_db_password
heroku config:set DB_NAME=your_db_name
heroku config:set PORT=3000
heroku config:set NODE_ENV=production
heroku config:set SECRET=your_jwt_secret
```

#### Deploy
```bash
git push heroku main
```

### 2. DigitalOcean Deployment

#### 1. Create Droplet
- OS: Ubuntu 20.04 LTS
- Size: 2GB RAM minimum
- Region: Pilih terdekat dengan user

#### 2. SSH into Server
```bash
ssh root@your_ip
```

#### 3. Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt install -y nodejs

# Install MySQL
apt install -y mysql-server

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2
```

#### 4. Setup Application
```bash
# Clone repository
git clone https://github.com/yourusername/PaketExpress_Dharma.git
cd PaketExpress_Dharma

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_USER=paket_user
DB_PASSWORD=secure_password
DB_NAME=paket_express
DB_PORT=3306
PORT=3000
NODE_ENV=production
SECRET=your_jwt_secret
EOF
```

#### 5. Setup MySQL
```bash
mysql -u root

# Create database and user
CREATE DATABASE paket_express;
CREATE USER 'paket_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON paket_express.* TO 'paket_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u paket_user -p paket_express < database_schema.sql
```

#### 6. Setup PM2
```bash
# Start application with PM2
pm2 start index.js --name "paketexpress"

# Enable auto-restart on reboot
pm2 startup
pm2 save

# Monitor
pm2 monit
```

#### 7. Setup Nginx Reverse Proxy
```bash
# Create nginx config
cat > /etc/nginx/sites-available/paketexpress << EOF
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/paketexpress /etc/nginx/sites-enabled/

# Test nginx
nginx -t

# Restart nginx
systemctl restart nginx
```

#### 8. Setup SSL with Let's Encrypt
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d your_domain.com

# Auto renewal
Systemctl enable certbot.timer
```

### 3. AWS Deployment

#### 1. Create EC2 Instance
- AMI: Ubuntu Server 20.04 LTS
- Instance Type: t3.small minimum
- Configure Security Group: Allow 22, 80, 443

#### 2. Connect and Setup
Ikuti langkah yang sama seperti DigitalOcean di atas.

#### 3. Use RDS untuk Database
- Create RDS MySQL instance
- Update .env dengan RDS endpoint
- Security group: Allow port 3306 from EC2

## Monitoring dan Maintenance

### 1. Setup Logging
```bash
# Check application logs
pm2 logs paketexpress

# Check nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. Database Backup
```bash
# Create backup script
cat > /home/ubuntu/backup.sh << 'EOF'
#!/bin/bash
DATEBACK=$(date +%Y%m%d_%H%M%S)
mysqldump -u paket_user -p$DB_PASSWORD paket_express > /backups/paket_express_$DATEBACK.sql
EOF

# Make executable
chmod +x /home/ubuntu/backup.sh

# Add to cron (daily at 2 AM)
0 2 * * * /home/ubuntu/backup.sh
```

### 3. Monitor Resources
```bash
# CPU and Memory
top

# Disk usage
df -h

# Network
netstat -an
```

## Performance Optimization

### 1. Enable Gzip Compression
```bash
# Add to nginx config
gzip on;
gzip_types text/html text/css application/json application/javascript;
gzip_min_length 1000;
```

### 2. Enable Caching
```bash
# Add to nginx config
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### 3. Database Query Optimization
- Add appropriate indexes
- Use EXPLAIN to analyze queries
- Implement connection pooling

## Security Checklist

- [ ] Use HTTPS only
- [ ] Update .env with strong secrets
- [ ] Enable firewall rules
- [ ] Setup fail2ban for brute force protection
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitor access logs
- [ ] Use environment variables for sensitive data

## Troubleshooting

### Application won't start
```bash
# Check logs
pm2 logs paketexpress

# Check port is available
lsof -i :3000

# Check database connection
mysql -u paket_user -p -h localhost paket_express
```

### High memory usage
```bash
# Check for memory leaks
pm2 monit

# Restart app
pm2 restart paketexpress
```

### Database connection issues
```bash
# Check MySQL status
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql
```

---

**Last Updated**: 2026-07-06

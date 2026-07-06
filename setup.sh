#!/bin/bash

# PaketExpress Development Setup Script

echo "🚀 PaketExpress Setup Script"
echo "================================"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js is not installed. Please install Node.js first."
    exit 1
fi
echo "✓ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "✓ Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Check .env file
echo "✓ Checking .env file..."
if [ ! -f .env ]; then
    echo "✗ .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✓ .env file created. Please update it with your configuration."
    echo ""
    echo "Edit .env file with your database credentials:"
    echo "  - DB_HOST"
    echo "  - DB_USER"
    echo "  - DB_PASSWORD"
    echo "  - DB_NAME"
    echo "  - SECRET (change to a secure value)"
    exit 1
fi
echo "✓ .env file found"
echo ""

# Create logs directory
echo "✓ Creating logs directory..."
mkdir -p logs
echo "✓ Logs directory created"
echo ""

# Create public/assets directory if not exists
echo "✓ Creating assets directory..."
mkdir -p public/assets
echo "✓ Assets directory created"
echo ""

echo "================================"
echo "✅ Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Create database and run schema:"
echo "   mysql -u root -p < DATABASE_SCHEMA.md"
echo "3. Start development server:"
echo "   npm run dev"
echo ""
echo "🌐 Application will run at http://localhost:3000"

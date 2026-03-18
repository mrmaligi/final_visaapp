#!/bin/bash
echo "=== Visa Helper Platform Setup ==="

# Install dependencies
echo "Installing dependencies..."
npm install

# Copy environment file
echo "Setting up environment..."
if [ ! -f .env.local ]; then
  cp .env.local.example .env.local 2>/dev/null || echo "Please create .env.local manually"
fi

echo ""
echo "=== Setup Complete ==="
echo "Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"

#!/bin/bash

# Mapbox Token Fix Script
# This script fixes issues with Mapbox tokens in static export builds

echo "🔧 Mapbox Token Fix Script"
echo "=========================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo ""
    echo "Please create .env.local with:"
    echo "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token_here"
    echo ""
    echo "Get your token from: https://account.mapbox.com/access-tokens/"
    exit 1
fi

# Check if token exists in .env.local
if ! grep -q "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN" .env.local; then
    echo "❌ Error: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN not found in .env.local!"
    echo ""
    echo "Please add to .env.local:"
    echo "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token_here"
    echo ""
    echo "Get your token from: https://account.mapbox.com/access-tokens/"
    exit 1
fi

# Check if token looks valid (starts with pk.)
TOKEN=$(grep "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN" .env.local | cut -d '=' -f2)
if [[ ! $TOKEN == pk.* ]]; then
    echo "⚠️  Warning: Token doesn't start with 'pk.' - it might be invalid"
    echo "Current token: $TOKEN"
    echo ""
fi

echo "✓ Found .env.local with NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN"
echo ""

# Clean build cache
echo "🧹 Cleaning build cache..."
if [ -d .next ]; then
    rm -rf .next
    echo "✓ Deleted .next folder"
fi

if [ -d out ]; then
    rm -rf out
    echo "✓ Deleted out folder"
fi
echo ""

# Rebuild
echo "🔨 Rebuilding application..."
echo "This will embed the environment variable into the build..."
echo ""

npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Start dev server: npm run dev"
    echo "2. Visit: http://localhost:3000/map-demo"
    echo "3. Verify map loads correctly"
    echo ""
    echo "📝 Note: With static export, you must rebuild every time"
    echo "   you change environment variables in .env.local"
else
    echo ""
    echo "❌ Build failed!"
    echo "Please check the error messages above."
    exit 1
fi

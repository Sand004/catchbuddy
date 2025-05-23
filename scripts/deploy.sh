#!/bin/bash

# CatchSmart Deployment Script

echo "🚀 Deploying CatchSmart..."

# Build all packages
echo "📦 Building packages..."
pnpm build

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

# Run tests
echo "🧪 Running tests..."
pnpm test

if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
pnpm deploy:vercel

if [ $? -ne 0 ]; then
  echo "❌ Vercel deployment failed"
  exit 1
fi

echo "✅ Deployment successful!"

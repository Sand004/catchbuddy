#!/bin/bash

# CatchSmart Development Setup Script

echo "🎣 Setting up CatchSmart development environment..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required but not installed."; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Setup environment variables
if [ ! -f .env.local ]; then
  echo "🔧 Setting up environment variables..."
  cp .env.example .env.local
  echo "✅ Created .env.local - Please configure your API keys"
else
  echo "✅ Environment file already exists"
fi

# Setup Supabase (if CLI is available)
if command -v supabase >/dev/null 2>&1; then
  echo "🗄️ Setting up Supabase..."
  cd packages/database
  supabase start
  cd ../..
  echo "✅ Supabase is running locally"
else
  echo "⚠️ Supabase CLI not found - please install it for database setup"
fi

echo "🚀 Setup complete! Run 'pnpm dev' to start development"
echo ""
echo "Next steps:"
echo "1. Configure API keys in .env.local"
echo "2. Set up Supabase project (if using cloud)"
echo "3. Run 'pnpm db:migrate' to set up database"
echo "4. Run 'pnpm dev' to start development servers"

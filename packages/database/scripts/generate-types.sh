#!/bin/bash

# Generate TypeScript types from Supabase database
echo "🔄 Generating TypeScript types from Supabase..."

# Make sure you're in the database package directory
cd "$(dirname "$0")/.."

# Generate types using Supabase CLI
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts

echo "✅ Types generated successfully!"
echo "📝 Don't forget to replace YOUR_PROJECT_ID with your actual Supabase project ID"

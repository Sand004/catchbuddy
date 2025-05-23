# Completing AI-002: Supabase Schema & Migrations

## ✅ What's Already Done

Since you've already run the SQL migrations in your Supabase project, the database structure is complete:

- ✅ All tables created (profiles, equipment_items, fishing_trips, catches, etc.)
- ✅ pgvector extension enabled
- ✅ Row Level Security (RLS) policies configured
- ✅ Storage buckets created
- ✅ Triggers and functions set up

## 📋 Steps to Complete AI-002

### 1. Generate TypeScript Types (Required)

This step creates TypeScript types from your actual database schema:

```bash
# Navigate to database package
cd packages/database

# Option A: If you're running Supabase locally
npx supabase gen types typescript --local > types/database.ts

# Option B: If using hosted Supabase (recommended)
# First link your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Then generate types
npx supabase gen types typescript --linked > types/database.ts
```

**Where to find your project ref:**
1. Go to your Supabase dashboard
2. Settings → General
3. Copy the "Reference ID"

### 2. Verify Generated Types

After generation, check `packages/database/types/database.ts` contains:
- All your tables (profiles, equipment_items, etc.)
- Proper TypeScript interfaces
- Function definitions (like search_similar_equipment)

### 3. Test Type Integration

The Supabase clients are already configured to use these types. Test by:

```typescript
// In any component
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// TypeScript should now autocomplete table names and columns
const { data } = await supabase
  .from('profiles') // ← autocomplete!
  .select('*')
```

### 4. (Optional) Create Seed Data

If you want test data:

```bash
cd packages/database
# Edit scripts/seed.js with your test data
pnpm seed
```

## 🎯 That's It!

Once you've generated the types, AI-002 is complete. The database is fully integrated with:
- Type-safe queries
- Autocomplete in your IDE
- Compile-time error checking

## 📝 Verification Checklist

- [ ] Types generated in `packages/database/types/database.ts`
- [ ] No TypeScript errors when importing Database type
- [ ] Supabase queries have autocomplete
- [ ] Auth flow creates profile automatically (via trigger)

## 🚨 Common Issues

**"Project ref not found"**
- Make sure you're logged in: `npx supabase login`
- Check your project ref is correct

**"Permission denied"**
- Ensure your Supabase project has the correct permissions
- Check your API keys in `.env.local`

**Types not updating**
- Delete the old file first: `rm packages/database/types/database.ts`
- Regenerate fresh

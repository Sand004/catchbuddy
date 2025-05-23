# CatchSmart Database Package

This package contains all database-related code for the CatchSmart application.

## 🗃️ Database Schema

The database uses PostgreSQL with Supabase and includes:

- **pgvector** extension for AI embeddings
- **PostGIS** for location data
- **Row Level Security (RLS)** for data protection

### Tables

1. **profiles** - User profiles extending Supabase auth
2. **equipment_items** - Fishing equipment with AI embeddings
3. **fishing_trips** - Trip tracking with location data
4. **catches** - Fish catches with success factors
5. **recommendations** - AI-generated recommendations
6. **affiliate_clicks** - Affiliate tracking
7. **user_sessions** - Analytics

### Storage Buckets

- `equipment-images` - Public equipment photos
- `catch-photos` - Public catch photos
- `receipts` - Private purchase receipts
- `avatars` - Public user avatars

## 🚀 Setup

### Prerequisites

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Have a Supabase project ready

### Initial Setup

1. Link your Supabase project:
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```

2. Run migrations (if not already done):
   ```bash
   npx supabase db push
   ```

3. Generate TypeScript types:
   ```bash
   pnpm generate-types
   ```

## 📝 Common Commands

```bash
# Generate TypeScript types from database
pnpm generate-types

# Run migrations
pnpm migrate

# Reset database (DANGER: deletes all data!)
pnpm reset

# Seed database with test data
pnpm seed
```

## 🔐 Security

All tables have Row Level Security (RLS) enabled:

- Users can only see/edit their own data
- System can insert recommendations
- Public read access for shared data only

## 🧮 Vector Search

The database includes pgvector for AI-powered similarity search:

```sql
-- Example: Find similar equipment
SELECT * FROM search_similar_equipment(
  query_embedding := '[0.1, 0.2, ...]'::vector,
  match_threshold := 0.78,
  match_count := 10,
  user_filter := 'user-uuid'
);
```

## 📊 Key Functions

- `handle_new_user()` - Creates profile on signup
- `handle_updated_at()` - Updates timestamps
- `search_similar_equipment()` - Vector similarity search

## 🎣 Equipment Types

- `lure` - Köder
- `rod` - Rute
- `reel` - Rolle
- `line` - Schnur
- `bait` - Naturköder
- `tackle` - Zubehör
- `other` - Sonstiges

## 💳 Subscription Tiers

- `free` - 10 items, 2 recommendations/day
- `pro` - 100 items, 20 recommendations/day
- `premium` - Unlimited everything

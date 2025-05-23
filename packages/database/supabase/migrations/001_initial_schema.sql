-- Enable pgvector extension
create extension if not exists vector;

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  full_name text,
  avatar_url text,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'pro', 'premium')),
  language text default 'de' check (language in ('de', 'en', 'es')),
  usage_limits jsonb default '{
    "daily_recommendations": 2,
    "total_equipment": 10,
    "ai_queries_used": 0,
    "last_reset": null
  }'::jsonb,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Equipment items table
create table public.equipment_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('lure', 'rod', 'reel', 'line', 'bait', 'tackle', 'other')),
  brand text,
  model text,
  color text,
  size text,
  weight decimal,
  attributes jsonb default '{}'::jsonb,
  image_url text,
  purchase_info jsonb default '{}'::jsonb, -- price, shop, receipt_url, purchase_date
  embedding vector(1536), -- OpenAI embeddings
  tags text[] default array[]::text[],
  is_favorite boolean default false,
  condition text default 'good' check (condition in ('new', 'good', 'fair', 'poor')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Fishing trips table
create table public.fishing_trips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  location point not null,
  location_name text not null,
  water_type text check (water_type in ('freshwater', 'saltwater', 'brackish')),
  started_at timestamptz not null,
  ended_at timestamptz,
  weather_data jsonb default '{}'::jsonb, -- temperature, wind, pressure, conditions
  water_conditions jsonb default '{}'::jsonb, -- temperature, clarity, flow, depth
  target_species text[],
  notes text,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Catches table
create table public.catches (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references public.fishing_trips(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  species text not null,
  weight decimal,
  length decimal,
  equipment_used uuid[] default array[]::uuid[], -- Array of equipment_item IDs
  bait_used text,
  technique text,
  location point,
  depth decimal,
  photo_urls text[] default array[]::text[],
  notes text,
  weather_conditions jsonb default '{}'::jsonb,
  success_factors jsonb default '{}'::jsonb, -- factors that led to success
  is_released boolean default false,
  rating integer check (rating >= 1 and rating <= 5),
  caught_at timestamptz not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AI Recommendations table
create table public.recommendations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  context jsonb not null, -- weather, location, target_species, time_of_day, etc.
  recommended_items uuid[] default array[]::uuid[], -- equipment_item IDs
  reasoning text not null,
  confidence_score decimal check (confidence_score >= 0 and confidence_score <= 1),
  llm_response jsonb default '{}'::jsonb, -- full LLM response data
  user_feedback integer check (user_feedback >= 1 and user_feedback <= 5),
  was_used boolean default false,
  success_outcome boolean, -- did it lead to a catch?
  created_at timestamptz default now()
);

-- Affiliate tracking table
create table public.affiliate_clicks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  equipment_id uuid references public.equipment_items(id) on delete set null,
  shop text not null,
  product_url text not null,
  affiliate_code text,
  clicked_at timestamptz default now(),
  ip_address inet,
  user_agent text,
  converted boolean default false,
  conversion_amount decimal,
  commission decimal
);

-- User sessions/analytics
create table public.user_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  session_start timestamptz default now(),
  session_end timestamptz,
  pages_visited integer default 0,
  features_used text[] default array[]::text[],
  device_info jsonb default '{}'::jsonb
);

-- Create indexes for performance
create index idx_equipment_user_id on public.equipment_items(user_id);
create index idx_equipment_type on public.equipment_items(type);
create index idx_equipment_embedding on public.equipment_items using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create index idx_trips_user_id on public.fishing_trips(user_id);
create index idx_trips_location on public.fishing_trips using gist(location);
create index idx_trips_started_at on public.fishing_trips(started_at);

create index idx_catches_trip_id on public.catches(trip_id);
create index idx_catches_user_id on public.catches(user_id);
create index idx_catches_species on public.catches(species);
create index idx_catches_caught_at on public.catches(caught_at);

create index idx_recommendations_user_id on public.recommendations(user_id);
create index idx_recommendations_created_at on public.recommendations(created_at);

create index idx_affiliate_clicks_user_id on public.affiliate_clicks(user_id);
create index idx_affiliate_clicks_clicked_at on public.affiliate_clicks(clicked_at);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.equipment_items enable row level security;
alter table public.fishing_trips enable row level security;
alter table public.catches enable row level security;
alter table public.recommendations enable row level security;
alter table public.affiliate_clicks enable row level security;
alter table public.user_sessions enable row level security;

-- Create RLS policies
-- Profiles: Users can only see and edit their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Equipment: Users can only see and manage their own equipment
create policy "Users can view own equipment" on public.equipment_items
  for select using (auth.uid() = user_id);

create policy "Users can insert own equipment" on public.equipment_items
  for insert with check (auth.uid() = user_id);

create policy "Users can update own equipment" on public.equipment_items
  for update using (auth.uid() = user_id);

create policy "Users can delete own equipment" on public.equipment_items
  for delete using (auth.uid() = user_id);

-- Similar policies for other tables
create policy "Users can manage own trips" on public.fishing_trips
  for all using (auth.uid() = user_id);

create policy "Users can manage own catches" on public.catches
  for all using (auth.uid() = user_id);

create policy "Users can view own recommendations" on public.recommendations
  for select using (auth.uid() = user_id);

create policy "System can insert recommendations" on public.recommendations
  for insert with check (true); -- Allows system to insert

create policy "Users can update recommendation feedback" on public.recommendations
  for update using (auth.uid() = user_id);

create policy "Users can view own affiliate clicks" on public.affiliate_clicks
  for select using (auth.uid() = user_id);

create policy "System can track affiliate clicks" on public.affiliate_clicks
  for insert with check (true);

create policy "Users can view own sessions" on public.user_sessions
  for select using (auth.uid() = user_id);

create policy "System can manage sessions" on public.user_sessions
  for all using (true);

-- Create storage buckets
insert into storage.buckets (id, name, public) values 
  ('equipment-images', 'equipment-images', true),
  ('catch-photos', 'catch-photos', true),
  ('receipts', 'receipts', false),
  ('avatars', 'avatars', true);

-- Storage policies
create policy "Users can upload equipment images" on storage.objects
  for insert with check (
    bucket_id = 'equipment-images' and 
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Equipment images are publicly viewable" on storage.objects
  for select using (bucket_id = 'equipment-images');

create policy "Users can upload catch photos" on storage.objects
  for insert with check (
    bucket_id = 'catch-photos' and 
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Catch photos are publicly viewable" on storage.objects
  for select using (bucket_id = 'catch-photos');

-- Functions for updated_at triggers
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create updated_at triggers
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger handle_equipment_updated_at
  before update on public.equipment_items
  for each row execute function public.handle_updated_at();

create trigger handle_trips_updated_at
  before update on public.fishing_trips
  for each row execute function public.handle_updated_at();

create trigger handle_catches_updated_at
  before update on public.catches
  for each row execute function public.handle_updated_at();

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function to search equipment by similarity
create or replace function search_similar_equipment(
  query_embedding vector(1536),
  match_threshold float default 0.78,
  match_count int default 10,
  user_filter uuid default null
)
returns table (
  id uuid,
  name text,
  type text,
  brand text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    equipment_items.id,
    equipment_items.name,
    equipment_items.type,
    equipment_items.brand,
    1 - (equipment_items.embedding <=> query_embedding) as similarity
  from equipment_items
  where 
    (user_filter is null or equipment_items.user_id = user_filter)
    and 1 - (equipment_items.embedding <=> query_embedding) > match_threshold
  order by equipment_items.embedding <=> query_embedding
  limit match_count;
end;
$$;
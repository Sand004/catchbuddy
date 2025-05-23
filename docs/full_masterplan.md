# CatchSmart - Detaillierter Master-Plan & Task-Aufteilung v2025

## 🎯 Executive Summary

**CatchSmart** ist eine KI-gestützte Angel-App, die als PWA entwickelt wird und Anglern personalisierte Köderempfehlungen basierend auf ihrem Equipment, Fanghistorie, Wetter und Standort bietet.

### Kern-Features MVP
- 📸 Equipment-Management mit Bilderkennung (Google Vision API)
- 🤖 LLM-basierter Empfehlungsassistent mit Kontext-Zugriff
- 📊 Fang-Logbuch mit Statistiken
- 💰 Freemium-Modell mit Abo (Free: 10 Köder, 2 Empfehlungen/Tag)
- 🌍 Mehrsprachig (DE, ES, EN) von Tag 1
- 🔗 Affiliate-Integration für Monetarisierung

---

## 🏗️ Technologie-Stack & Architektur

### Frontend (PWA)
- **Framework**: Next.js 14 mit App Router
- **UI**: Tailwind CSS + shadcn/ui
- **State**: Zustand + React Query
- **Offline**: PWA Service Worker + IndexedDB
- **Mobile**: Capacitor für App Store Deployment

### Backend
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **Vector DB**: Supabase pgvector Extension
- **AI/LLM**: OpenAI GPT-4o + LangChain
- **Image Recognition**: Google Cloud Vision API
- **Weather**: Open-Meteo API (kostenlos)
- **Edge Functions**: Supabase Edge Functions
- **Storage**: Supabase Storage für Bilder

### Infrastructure
- **Hosting**: Vercel (Frontend) + Supabase (Backend)
- **Monitoring**: Sentry + Vercel Analytics
- **CI/CD**: GitHub Actions
- **Payments**: RevenueCat (iOS/Android) + Stripe (Web)

---

## 📊 Datenmodell (Optimiert)

```sql
-- Core Tables
users (
  id uuid primary key,
  email text unique,
  subscription_tier text default 'free',
  language text default 'de',
  created_at timestamp
)

equipment_items (
  id uuid primary key,
  user_id uuid references users,
  name text,
  type text, -- 'lure', 'rod', 'reel', etc.
  brand text,
  attributes jsonb, -- flexible für verschiedene Equipment-Typen
  image_url text,
  purchase_info jsonb, -- receipt data, price, shop
  embedding vector(1536), -- für Similarity Search
  created_at timestamp
)

fishing_trips (
  id uuid primary key,
  user_id uuid references users,
  location point,
  location_name text,
  started_at timestamp,
  ended_at timestamp,
  weather_data jsonb,
  water_conditions jsonb
)

catches (
  id uuid primary key,
  trip_id uuid references fishing_trips,
  species text,
  weight decimal,
  length decimal,
  equipment_used uuid[], -- Array von equipment_item IDs
  photo_url text,
  notes text,
  caught_at timestamp,
  success_factors jsonb -- Köder, Technik, etc.
)

recommendations (
  id uuid primary key,
  user_id uuid references users,
  context jsonb, -- Wetter, Location, Target Species
  recommended_items uuid[],
  reasoning text,
  llm_response jsonb,
  created_at timestamp
)

-- Affiliate Tracking
affiliate_clicks (
  id uuid primary key,
  user_id uuid references users,
  equipment_id uuid,
  shop text,
  product_url text,
  clicked_at timestamp
)
```

---

## 🔄 Implementierungs-Phasen

### Phase 1: Foundation (Woche 1-2)

#### MANUELLE TASKS (You)
- [x] MAN-001: Supabase Projekt erstellen & konfigurieren
- [x] MAN-002: GitHub Repo aufsetzen mit Monorepo-Struktur
- [x] MAN-003: Vercel Account & Deployment Pipeline
- [x] MAN-004: Google Cloud Vision API aktivieren & Keys
- [x] MAN-005: RevenueCat Account & Produkte anlegen
- [X] MAN-006: Domain registrieren & DNS Setup

#### AI-AGENT TASKS
- [x] AI-001: Next.js PWA Boilerplate mit TypeScript generieren (partially complete - needs auth)
- [ ] AI-002: Supabase Schema & Migrations erstellen
- [x] AI-003: Tailwind + shadcn/ui Setup & Theme
- [x] AI-004: Service Worker für Offline-Funktionalität
- [x] AI-005: i18n Setup mit next-intl (DE, ES, EN) – COMPLETE ✅
    - App ist jetzt vollständig internationalisiert:
        - 🇩🇪 Deutsch (primär)
        - 🇬🇧 Englisch
        - 🇪🇸 Spanisch
    - Alle zukünftigen Features müssen das Übersetzungssystem verwenden (useTranslations von next-intl importieren).
- [x] AI-006: Basic Auth Flow (Login/Register/Reset) – COMPLETE ✅
- [x] AI-006: Complete auth system with email, Google, and Apple login
- [x] AI-029: Tailwind-Tokens in packages/ui/tailwind.config.ts definieren
- [ ] AI-030: Figma Brand-Sheet (Farben, Text Styles, Komponenten)
- [ ] AI-031: Storybook mit Button, Card, Chart Showcase

### Phase 2: Core Features (Woche 3-4)

#### MANUELLE TASKS
- [ ] MAN-007: Test-Datensatz mit Angel-Equipment erstellen
- [ ] MAN-008: Affiliate-Partner kontaktieren (Decathlon, etc.)
- [ ] MAN-009: App Store Developer Accounts (iOS/Android)
- [ ] MAN-010: Datenschutz & AGB von Anwalt prüfen lassen

#### AI-AGENT TASKS
- [ ] AI-007: Equipment Management UI (CRUD)
- [ ] AI-008: Image Upload & Google Vision Integration
- [ ] AI-009: Receipt Parser für automatisches Equipment-Import
- [ ] AI-010: Equipment-Galerie mit Filter & Suche
- [ ] AI-011: Offline-Sync Logic mit Conflict Resolution
- [ ] AI-012: Equipment Embedding Generation Pipeline

### Phase 3: AI Assistant (Woche 5-6)

#### MANUELLE TASKS
- [ ] MAN-011: OpenAI API Limits & Kosten monitoren
- [ ] MAN-012: LLM Prompts testen & optimieren
- [ ] MAN-013: Beta-Tester Gruppe aufbauen (10-20 Angler)

#### AI-AGENT TASKS
- [ ] AI-013: LangChain Agent Setup mit Tools
- [ ] AI-014: Weather API Integration (Open-Meteo)
- [ ] AI-015: Vector Search für ähnliche Fänge
- [ ] AI-016: Recommendation Engine mit Context
- [ ] AI-017: Chat UI für Assistent
- [ ] AI-018: Recommendation History & Analytics

### Phase 4: Monetization (Woche 7-8)

#### MANUELLE TASKS
- [ ] MAN-014: Stripe/RevenueCat Produkte final konfigurieren
- [ ] MAN-015: App Store Listings vorbereiten
- [ ] MAN-016: Marketing-Material erstellen

#### AI-AGENT TASKS
- [ ] AI-019: Paywall UI mit Subscription Tiers
- [ ] AI-020: Usage Limits Implementation (10 Köder, 2 Queries)
- [ ] AI-021: Affiliate Link Integration & Tracking
- [ ] AI-022: Admin Dashboard für Metriken
- [ ] AI-023: Email Notifications (Welcome, Upgrade)

### Phase 5: Polish & Launch (Woche 9-10)

#### MANUELLE TASKS
- [ ] MAN-017: App Store Submissions
- [ ] MAN-018: Launch Marketing Campaign
- [ ] MAN-019: Support-System aufsetzen
- [ ] MAN-020: Monitoring & Alerts konfigurieren

#### AI-AGENT TASKS
- [ ] AI-024: Performance Optimierungen
- [ ] AI-025: Error Tracking & User Feedback
- [ ] AI-026: A/B Testing Framework
- [ ] AI-027: Onboarding Tour
- [ ] AI-028: PWA Install Prompts

---

## 🎯 Detaillierte Task-Beschreibungen

### AI-AGENT TASK TEMPLATES

#### AI-001: Next.js PWA Boilerplate
```typescript
// Requirements:
- Next.js 14 mit App Router
- TypeScript strict mode
- PWA manifest.json
- Service Worker Registration
- Tailwind CSS
- Zustand Store Setup
- React Query Provider
- Environment Variables Setup

// Deliverables:
- /app Layout mit Navigation
- Responsive Mobile-First Design
- Loading & Error States
- Basic SEO Setup
```

#### AI-008: Image Upload & Vision Integration
```typescript
// Requirements:
- Drag & Drop Upload Component
- Camera Access für Mobile
- Image Compression vor Upload
- Google Vision API Integration
- Köder-Typ Erkennung
- Marken-Erkennung
- Text/Label Extraction von Verpackungen

// API Flow:
1. User uploaded Bild
2. Compress & Upload zu Supabase Storage
3. Send zu Vision API
4. Parse Results (Labels, Text, Logos)
5. Auto-Fill Equipment Form
6. User kann korrigieren
7. Save mit Embedding Generation
```

#### AI-013: LangChain Agent Setup
```typescript
// Agent Tools:
- SQL Tool: Query user's equipment & catches
- Vector Search: Find similar successful catches
- Weather Tool: Get current & forecast data
- Web Search: Research spots & techniques
- Calculator: Success rate analysis

// Context Builder:
- User's Equipment Inventory
- Recent Catches (last 10)
- Current Location & Weather
- Target Species
- Time of Day/Season

// Prompt Template:
"Du bist ein erfahrener Angel-Guide mit Zugriff auf:
- Persönliche Köder-Box des Anglers
- Erfolgreiche Fänge in der Vergangenheit
- Aktuelle Wetterbedingungen
- Gewässer-Informationen

Empfehle die 3 besten Köder mit Begründung..."
```

### MANUELLE TASK DETAILS

#### MAN-001: Supabase Setup
1. Projekt auf supabase.com erstellen
2. Database Password sicher speichern
3. Row Level Security aktivieren
4. pgvector Extension aktivieren:
   ```sql
   create extension vector;
   ```
5. Storage Buckets erstellen:
   - equipment-images (public)
   - catch-photos (public)
   - receipts (private)

#### MAN-004: Google Cloud Vision Setup
1. GCP Projekt erstellen
2. Vision API aktivieren
3. Service Account mit Vision API Rolle
4. JSON Key downloaden
5. Budget Alert bei 50€/Monat setzen

---

## 💰 Kosten-Kalkulation (1000 MAU)

| Service | Kosten/Monat | Notizen |
|---------|--------------|---------|
| Supabase Pro | 50€ | Auth, DB, Storage, Realtime |
| Google Vision | 45€ | ~30 Bilder/User/Monat |
| OpenAI GPT-4 | 80€ | ~800 Empfehlungen |
| Vercel Pro | 20€ | Frontend Hosting |
| RevenueCat | 0€ | Unter 10k Revenue free |
| Open-Meteo | 0€ | Fair Use |
| **TOTAL** | **195€** | |

**Break-Even**: ~40 zahlende User bei 4,99€/Monat

---

## 🚀 Launch Checkliste

### 2 Wochen vor Launch
- [ ] Beta Test mit 20 Anglern abgeschlossen
- [ ] Alle kritischen Bugs gefixed
- [ ] Performance unter 3s Ladezeit
- [ ] Offline-Modus getestet

### 1 Woche vor Launch
- [ ] App Store Approvals erhalten
- [ ] Marketing-Kampagne vorbereitet
- [ ] Support-FAQ erstellt
- [ ] Server-Kapazität geprüft

### Launch Day
- [ ] Monitoring Dashboard öffnen
- [ ] Social Media Posts
- [ ] Angel-Foren Ankündigungen
- [ ] Influencer benachrichtigen

---

## 🔧 Entwickler-Befehle

```bash
# Setup
git clone https://github.com/[your-org]/catchsmart
cd catchsmart
pnpm install

# Development
pnpm dev           # Start Next.js dev server
pnpm db:migrate    # Run Supabase migrations
pnpm db:seed       # Seed test data
pnpm test          # Run test suite

# Deployment
pnpm build         # Build for production
pnpm deploy:vercel # Deploy to Vercel
pnpm deploy:apps   # Build mobile apps

# AI Agent Development
pnpm agent:test    # Test LangChain agent
pnpm embeddings    # Generate embeddings
```

---

## 📝 Wichtige Entscheidungen & Begründungen

### PWA statt Native
- **Pro**: Eine Codebase, schnellere Updates, keine App Store Delays
- **Pro**: Offline-Support via Service Worker
- **Pro**: Installation via Browser oder Capacitor-Wrapper
- **Contra**: Minimal schlechtere Performance
- **Lösung**: Capacitor für App Store Distribution

### Supabase statt Custom Backend
- **Pro**: Auth, Realtime, Storage out-of-the-box
- **Pro**: pgvector für Embeddings integriert
- **Pro**: Günstig und skalierbar
- **Pro**: RLS für Sicherheit

### Google Vision statt Custom ML
- **Pro**: Sehr genau bei Produkterkennung
- **Pro**: Keine eigenen Trainingsdaten nötig
- **Pro**: Pay-per-Use Modell
- **Alternative**: Später eigenes Modell trainieren

### LangChain für Agent
- **Pro**: Bewährte Tool-Integration
- **Pro**: Einfaches Prompt-Management
- **Pro**: Memory & Context Handling
- **Pro**: Streaming Support

---

## 🎨 UI/UX Patterns

### Mobile-First Design Prinzipien
- Bottom Navigation für Hauptbereiche
- Swipe-Gesten für schnelle Aktionen
- Große Touch-Targets (min 44x44px)
- Skeleton Loading States
- Pull-to-Refresh überall

### Offline-First Patterns
- Optimistic Updates
- Sync-Status Indicators
- Conflict Resolution UI
- Download-Prioritäten
- Cache-Management Settings

### KI-Assistent UX
- Chat-Interface mit Quick Actions
- Transparente Reasoning-Anzeige
- Köder-Karten mit Swipe
- Kontext-Anzeige (Wetter, Ort)
- Feedback-Buttons für Lernen

---

## 🔐 Sicherheit & Datenschutz

### Implementierte Maßnahmen
- Row Level Security in Supabase
- Verschlüsselte API Keys
- DSGVO-konforme Datenverarbeitung
- Recht auf Löschung implementiert
- Keine Tracker außer eigene Analytics

### Datenschutz-Features
- Lokale Datenhaltung wo möglich
- Explizite Consent für Cloud-Sync
- Anonyme Nutzung möglich
- Export aller persönlichen Daten
- Account-Löschung in App

---

🎨 Brand Identity & Design System

Diese Sektion definiert Farben, Typografie und UI‑Komponenten‑Standards. Alle Werte werden als Tailwind‑Design‑Tokens hinterlegt und in Figma dokumentiert, sodass spätere Features ohne Design‑Drift integriert werden können.

Farbpalette (Dark Theme – WCAG AA)

Token

HEX

Verwendung

--color-bg

#0F1B2B

Haupt‑Hintergrund

--color-surface

#182436

Karten & Modals

--color-primary

#1EC6FF

Buttons, Links, aktive Icons

--color-primary-hover

#17A6D5

Hover/Pressed State

--color-secondary

#41E39D

Success, positive Graphen

--color-error

#FF5A5F

Fehlermeldungen

--color-text

#E5F4FF

Fließtext

--color-text-muted

#9CB5C9

Sekundärer Text

Light Theme (optional): identische Hues, jedoch L
a = 92 % für Background, Text = #172432.

Typografie

Inter (Google Font) – Headlines 700, Body 400.

JetBrains Mono – Zahlen, Code‑Blöcke.

Basisgröße 16 px; H1 → 2.25 rem, H2 → 1.75 rem.

UI‑Komponente Standards

Cards: rounded-2xl, shadow-lg/25, Padding p-4.

Buttons: Primär → bg-primary text-bg; Sekundär → transparent, border-primary.

Charts (Recharts): Linienfarbe color-primary, Tooltip bg color-surface.

Icons: Lucide 24 px, Stroke 1.75 px, Farbe currentColor.

Brand Voice

Kompetent & ruhig – kein Clickbait.

Hilfsbereit – klare Tooltips, Micro‑Copy.

Naturverbunden – subtile Wasser‑/Grün‑Akzente; keine Neon‑Reizüberflutung.

Dieser Plan ist als "Living Document" konzipiert und wird kontinuierlich von AI-Agenten und dem Team erweitert. Alle Tasks sind so strukturiert, dass sie unabhängig bearbeitet werden können.

## Dependencies Added:
- @supabase/ssr (for server-side auth)

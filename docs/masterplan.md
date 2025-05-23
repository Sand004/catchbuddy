# CatchSmart - Master Plan v2025

> Detaillierter Entwicklungsplan der KI-gestützten Angel-App

## 🎯 Executive Summary

**CatchSmart** ist eine KI-gestützte Angel-App, die als PWA entwickelt wird und Anglern personalisierte Köderempfehlungen basierend auf ihrem Equipment, Fanghistorie, Wetter und Standort bietet.

### Kern-Features MVP
- 📸 Equipment-Management mit Bilderkennung (Google Vision API)
- 🤖 LLM-basierter Empfehlungsassistent mit Kontext-Zugriff
- 📊 Fang-Logbuch mit Statistiken
- 💰 Freemium-Modell mit Abo (Free: 10 Köder, 2 Empfehlungen/Tag)
- 🌍 Mehrsprachig (DE, ES, EN) von Tag 1
- 🔗 Affiliate-Integration für Monetarisierung

## 🏗️ Technologie-Stack

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

## 📊 Development Progress

### Phase 1: Foundation ✅ COMPLETE
- ✅ AI-001: Next.js PWA Boilerplate 
- ✅ AI-002: Supabase Schema & Migrations
- ✅ AI-003: Tailwind + shadcn/ui Setup
- ✅ AI-004: Service Worker für Offline
- ✅ AI-005: i18n Setup (DE, ES, EN)
- ✅ AI-006: Basic Auth Flow
- ✅ AI-029: Tailwind Design Tokens
- ⏳ AI-030: Figma Brand-Sheet (optional)
- ⏳ AI-031: Storybook (optional)

### Phase 2: Core Features 🚧 IN PROGRESS
- ✅ AI-007: Equipment Management UI (CRUD) - **COMPLETE 2025-05-23**
- [ ] AI-008: Image Upload & Google Vision Integration
- [ ] AI-009: Receipt Parser für automatisches Equipment-Import
- [ ] AI-010: Equipment-Galerie mit Filter & Suche
- [ ] AI-011: Offline-Sync Logic mit Conflict Resolution
- [ ] AI-012: Equipment Embedding Generation Pipeline

*Vollständiger Master-Plan siehe: [Full Masterplan](./full_masterplan.md)*

## Dependencies Added:
- @supabase/ssr (for server-side auth)
- zod (for form validation)

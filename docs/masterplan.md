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

### Neue Tasks Phase 1 (2025)
- AI-029: Tailwind-Tokens in packages/ui/tailwind.config.ts definieren
- AI-030: Figma Brand-Sheet (Farben, Text Styles, Komponenten)
- AI-031: Storybook mit Button, Card, Chart Showcase

**Status:** AI-001 (partially), AI-003, AI-004, AI-029 = COMPLETE (siehe full_masterplan.md)

*Vollständiger Master-Plan siehe: [Original Dokument](../catchsmart-masterplan.md)*

## Dependencies Added:
- @supabase/ssr (for server-side auth)

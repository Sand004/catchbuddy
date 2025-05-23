# 🎣 CatchSmart

> KI-gestützte Angel-App mit personalisierten Köderempfehlungen

## ✨ Features

- 📸 **Equipment-Management** mit Bilderkennung (Google Vision API)
- 🤖 **LLM-basierter Empfehlungsassistent** mit Kontext-Zugriff
- 📊 **Fang-Logbuch** mit Statistiken
- 💰 **Freemium-Modell** mit Abo (Free: 10 Köder, 2 Empfehlungen/Tag)
- 🌍 **Mehrsprachig** (DE, ES, EN) von Tag 1
- 🔗 **Affiliate-Integration** für Monetarisierung
- 📱 **PWA** mit Offline-Support

## 🏗️ Technologie-Stack

### Frontend
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
- **Weather**: Open-Meteo API

## 🚀 Schnellstart

### Voraussetzungen
- Node.js >= 18.17.0
- pnpm >= 8.0.0

### Installation

```bash
# Repository klonen
git clone https://github.com/Sand004/catchsmart.git
cd catchsmart

# Dependencies installieren
pnpm install

# Environment Variables kopieren
cp .env.example .env.local
# Konfiguriere deine API Keys in .env.local

# Database Setup
pnpm db:migrate
pnpm db:seed

# Development Server starten
pnpm dev
```

## 📁 Projekt-Struktur

```
catchsmart/
├── apps/
│   ├── web/          # Next.js PWA Hauptapp
│   ├── mobile/       # Capacitor Mobile Apps
│   └── admin/        # Admin Dashboard
├── packages/
│   ├── ui/           # Shared UI Components
│   ├── database/     # Database Schema & Migrations
│   ├── ai-agent/     # LangChain AI Agent
│   └── shared/       # Shared utilities
├── docs/            # Dokumentation
└── scripts/         # Build & Deployment Scripts
```

## 📊 Implementierungs-Phasen

- [x] **Phase 1**: Foundation (Woche 1-2)
- [ ] **Phase 2**: Core Features (Woche 3-4)
- [ ] **Phase 3**: AI Assistant (Woche 5-6)
- [ ] **Phase 4**: Monetization (Woche 7-8)
- [ ] **Phase 5**: Polish & Launch (Woche 9-10)

Detaillierte Task-Liste siehe [Master-Plan](./docs/masterplan.md)

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📄 Lizenz

MIT License - siehe [LICENSE](./LICENSE) für Details.

## 📞 Support

Bei Fragen oder Problemen:
- 📧 Email: support@catchsmart.app
- 🐛 Issues: [GitHub Issues](https://github.com/Sand004/catchsmart/issues)
- 📖 Docs: [Dokumentation](./docs/README.md)

---

**Made with ❤️ by the CatchSmart Team**
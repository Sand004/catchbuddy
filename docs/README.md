# 📖 CatchSmart Dokumentation

## Übersicht

Willkommen zur CatchSmart Dokumentation! Hier findest du alle Informationen zur Entwicklung, Architektur und Nutzung der KI-gestützten Angel-App.

## 📚 Inhaltsverzeichnis

### Für Entwickler
- [Setup Guide](./setup.md) - Lokale Entwicklungsumgebung einrichten
- [Architektur](./architecture.md) - Technische Architektur und Entscheidungen
- [API Referenz](./api-reference.md) - Backend API Dokumentation
- [Datenbank Schema](./database-schema.md) - Datenbankstruktur und Relationen
- [Deployment](./deployment.md) - Deployment-Prozess und CI/CD

### Features & Komponenten
- [Equipment Management](./features/equipment.md) - Ausrüstungsverwaltung
- [AI Assistant](./features/ai-assistant.md) - KI-Empfehlungssystem
- [Catch Logging](./features/catch-logging.md) - Fang-Logbuch
- [PWA Features](./features/pwa.md) - Progressive Web App Funktionen
- [Mobile Apps](./features/mobile.md) - Native Mobile Integration

### Planung & Prozess
- [Master Plan](./masterplan.md) - Detaillierter Entwicklungsplan
- [Task Tracking](./task-tracking.md) - Fortschritt und offene Tasks
- [Testing Strategy](./testing.md) - Test-Strategie und Guidelines
- [Performance](./performance.md) - Performance-Optimierungen

### Business & Product
- [Monetization](./monetization.md) - Geschäftsmodell und Preisgestaltung
- [User Research](./user-research.md) - Nutzerforschung und Feedback
- [Marketing](./marketing.md) - Marketing-Strategie
- [Legal](./legal.md) - DSGVO, AGB und rechtliche Aspekte

## 🚀 Schnellstart

1. **Repository klonen:**
   ```bash
   git clone https://github.com/Sand004/catchsmart.git
   cd catchsmart
   ```

2. **Dependencies installieren:**
   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env.local
   # Konfiguriere deine API Keys
   ```

4. **Development starten:**
   ```bash
   pnpm dev
   ```

## 🏗️ Projekt-Struktur

```
catchsmart/
├── apps/
│   ├── web/          # Next.js PWA (Haupt-App)
│   ├── mobile/       # Capacitor Mobile Wrapper
│   └── admin/        # Admin Dashboard
├── packages/
│   ├── ui/           # Shared UI Components
│   ├── database/     # Supabase Schema & Migrations
│   ├── ai-agent/     # LangChain AI Agent
│   └── shared/       # Shared Types & Utils
├── docs/            # Diese Dokumentation
└── scripts/         # Build & Deployment Scripts
```

## 🔧 Entwicklung

### Prerequisites
- Node.js >= 18.17.0
- pnpm >= 8.0.0
- Supabase CLI
- Git

### Wichtige Commands
```bash
# Development
pnpm dev              # Alle Apps starten
pnpm build           # Production Build
pnpm test            # Tests ausführen

# Database
pnpm db:migrate      # Migrations ausführen
pnpm db:seed         # Test-Daten einfügen

# AI Agent
pnpm agent:test      # Agent testen
pnpm embeddings      # Embeddings generieren
```

## 📋 Aktuelle Phase

**Phase 1: Foundation** (Woche 1-2)
- [x] Repository Setup
- [x] Projekt-Struktur
- [ ] Supabase Konfiguration
- [ ] Next.js PWA Boilerplate
- [ ] Basis UI Components

➡️ Siehe [Task Tracking](./task-tracking.md) für Details

## 🤝 Contributing

1. Feature Branch erstellen
2. Änderungen implementieren
3. Tests schreiben/aktualisieren
4. Pull Request öffnen
5. Code Review abwarten

## 📞 Support

Bei Fragen oder Problemen:
- 🐛 **Bugs:** GitHub Issues
- 💬 **Diskussion:** GitHub Discussions
- 📧 **Direkt:** [E-Mail kontakt](mailto:dev@catchsmart.app)

## 📄 Lizenz

MIT License - Details siehe [LICENSE](../LICENSE)

---

**Letzte Aktualisierung:** 23. Mai 2025
**Version:** v0.1.0
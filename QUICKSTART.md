# 🚀 CatchSmart Quick Start

## Fix for Build Error

The missing `tailwindcss-animate` dependency has been added. Please run:

```bash
# From the project root
pnpm install

# Then navigate to the web app
cd apps/web

# Start the development server
pnpm dev
```

## If you still have issues:

1. **Clear node_modules and reinstall:**
   ```bash
   # From project root
   rm -rf node_modules
   rm -rf apps/*/node_modules
   rm -rf packages/*/node_modules
   pnpm install
   ```

2. **Clear Next.js cache:**
   ```bash
   cd apps/web
   rm -rf .next
   pnpm dev
   ```

## Test the app

The app should now run at http://localhost:3000

### Features to test:
- ✅ Landing page with hero section
- ✅ Dark theme with CatchSmart colors
- ✅ Responsive design
- ✅ Button and card components
- ✅ Service Worker (check DevTools → Application)

### Current Phase 1 Progress:
- [x] Tailwind design system
- [x] Basic UI components (Button, Card)
- [x] Landing page
- [x] PWA setup (manifest + service worker)
- [ ] Multi-language support (next)
- [ ] Auth pages (coming soon)

Enjoy testing! 🎣
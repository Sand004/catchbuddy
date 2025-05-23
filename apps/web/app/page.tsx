'use client'

import { Button } from '@catchsmart/ui/src/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@catchsmart/ui/src/components/card'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cs-bg via-cs-surface to-cs-bg px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-cs-primary/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 h-[400px] w-[400px] rounded-full bg-cs-secondary/20 blur-3xl" />
        </div>
        
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-cs-text sm:text-6xl lg:text-7xl">
            Fange mehr mit{' '}
            <span className="text-gradient">KI-Power</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-cs-text-muted sm:text-xl">
            CatchSmart analysiert Wetter, Standort und deine Ausrüstung, 
            um dir die perfekten Köder zu empfehlen. Wie ein erfahrener 
            Angel-Guide in deiner Tasche.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <Button size="lg" className="w-full sm:w-auto">
              Kostenlos starten
            </Button>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Demo ansehen
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-cs-text sm:text-4xl">
              Alles was du zum Angeln brauchst
            </h2>
            <p className="mt-4 text-lg text-cs-text-muted">
              Von der Köder-Verwaltung bis zur KI-Empfehlung
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="group hover:shadow-2xl/30 transition-all duration-300">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cs-primary/10 text-cs-primary">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <CardTitle>Köder-Scanner</CardTitle>
                <CardDescription>
                  Fotografiere deine Köder und lass sie automatisch erkennen und kategorisieren
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="group hover:shadow-2xl/30 transition-all duration-300">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cs-secondary/10 text-cs-secondary">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <CardTitle>KI-Empfehlungen</CardTitle>
                <CardDescription>
                  Erhalte personalisierte Köderempfehlungen basierend auf Wetter, Ort und Zielfisch
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="group hover:shadow-2xl/30 transition-all duration-300">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cs-primary/10 text-cs-primary">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <CardTitle>Fang-Statistiken</CardTitle>
                <CardDescription>
                  Verfolge deine Erfolge und lerne aus vergangenen Fängen für bessere Ergebnisse
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-cs-surface px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-cs-text sm:text-4xl">
              Einfache Preise
            </h2>
            <p className="mt-4 text-lg text-cs-text-muted">
              Starte kostenlos und upgrade wenn du mehr brauchst
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {/* Free Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Hobby-Angler</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">0€</span>
                  <span className="text-cs-text-muted">/Monat</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <svg className="mr-2 h-5 w-5 text-cs-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    10 Köder verwalten
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-5 w-5 text-cs-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    2 KI-Empfehlungen/Tag
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-5 w-5 text-cs-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Basis-Statistiken
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="relative border-cs-primary">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-cs-primary px-4 py-1 text-xs font-semibold text-cs-bg">
                  BELIEBT
                </span>
              </div>
              <CardHeader>
                <CardTitle>Profi-Angler</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">4,99€</span>
                  <span className="text-cs-text-muted">/Monat</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <svg className="mr-2 h-5 w-5 text-cs-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    100 Köder verwalten
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-5 w-5 text-cs-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    20 KI-Empfehlungen/Tag
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-5 w-5 text-cs-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Erweiterte Statistiken
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Premium Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Angel-Meister</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">9,99€</span>
                  <span className="text-cs-text-muted">/Monat</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <svg className="mr-2 h-5 w-5 text-cs-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unbegrenzte Köder
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-5 w-5 text-cs-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unbegrenzte KI-Empfehlungen
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-5 w-5 text-cs-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Premium Support & Features
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-cs-text sm:text-4xl">
            Bereit für mehr Fangerfolg?
          </h2>
          <p className="mt-4 text-lg text-cs-text-muted">
            Schließe dich tausenden Anglern an, die bereits mit CatchSmart erfolgreicher fischen.
          </p>
          <div className="mt-8">
            <Button size="lg" className="w-full sm:w-auto">
              Jetzt kostenlos starten
            </Button>
          </div>
          <p className="mt-4 text-sm text-cs-text-muted">
            Keine Kreditkarte erforderlich • 10 Köder kostenlos
          </p>
        </div>
      </section>
    </main>
  )
}
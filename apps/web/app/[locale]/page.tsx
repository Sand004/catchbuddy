'use client'

import { Button } from '@catchsmart/ui/src/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@catchsmart/ui/src/components/card'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const t = useTranslations()
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string
  const { user, signOut } = useAuthStore()

  const handleSignOut = async () => {
    await signOut()
    router.refresh()
  }

  return (
    <>
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <span className="text-2xl">🎣</span>
              <span className="font-bold text-xl">CatchSmart</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {user ? (
              <>
                <Link href={`/${locale}/equipment`}>
                  <Button variant="ghost" size="sm">
                    {t('navigation.equipment')}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href={`/${locale}/auth/login`}>
                  <Button variant="ghost" size="sm">
                    {t('auth.login.submit')}
                  </Button>
                </Link>
                <Link href={`/${locale}/auth/register`}>
                  <Button size="sm">
                    {t('auth.register.submit')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-cs-bg via-cs-surface to-cs-bg px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-cs-primary/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 h-[400px] w-[400px] rounded-full bg-cs-secondary/20 blur-3xl" />
          </div>
          
          <div className="mx-auto max-w-7xl text-center">
            <h1 
              className="text-4xl font-bold tracking-tight text-cs-text sm:text-6xl lg:text-7xl"
              dangerouslySetInnerHTML={{
                __html: t('home.hero.title').replace('<gradient>', '<span class="text-gradient">').replace('</gradient>', '</span>')
              }}
            />
            <p className="mx-auto mt-6 max-w-2xl text-lg text-cs-text-muted sm:text-xl">
              {t('home.hero.subtitle')}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
              <Link href={user ? `/${locale}/equipment` : `/${locale}/auth/register`}>
                <Button size="lg" className="w-full sm:w-auto">
                  {t('home.hero.cta.primary')}
                </Button>
              </Link>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                {t('home.hero.cta.secondary')}
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-cs-text sm:text-4xl">
                {t('home.features.title')}
              </h2>
              <p className="mt-4 text-lg text-cs-text-muted">
                {t('home.features.subtitle')}
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
                  <CardTitle>{t('home.features.scanner.title')}</CardTitle>
                  <CardDescription>
                    {t('home.features.scanner.description')}
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
                  <CardTitle>{t('home.features.ai.title')}</CardTitle>
                  <CardDescription>
                    {t('home.features.ai.description')}
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
                  <CardTitle>{t('home.features.stats.title')}</CardTitle>
                  <CardDescription>
                    {t('home.features.stats.description')}
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
                {t('home.pricing.title')}
              </h2>
              <p className="mt-4 text-lg text-cs-text-muted">
                {t('home.pricing.subtitle')}
              </p>
            </div>
            
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {/* Free Tier */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('home.pricing.free.name')}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{t('home.pricing.free.price')}</span>
                    <span className="text-cs-text-muted">{t('home.pricing.free.period')}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    {(t.raw('home.pricing.free.features') as string[]).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="mr-2 h-5 w-5 text-cs-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Pro Tier */}
              <Card className="relative border-cs-primary">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-cs-primary px-4 py-1 text-xs font-semibold text-cs-bg">
                    {t('home.pricing.pro.badge')}
                  </span>
                </div>
                <CardHeader>
                  <CardTitle>{t('home.pricing.pro.name')}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{t('home.pricing.pro.price')}</span>
                    <span className="text-cs-text-muted">{t('home.pricing.pro.period')}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    {(t.raw('home.pricing.pro.features') as string[]).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="mr-2 h-5 w-5 text-cs-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Premium Tier */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('home.pricing.premium.name')}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{t('home.pricing.premium.price')}</span>
                    <span className="text-cs-text-muted">{t('home.pricing.premium.period')}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    {(t.raw('home.pricing.premium.features') as string[]).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="mr-2 h-5 w-5 text-cs-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
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
              {t('home.cta.title')}
            </h2>
            <p className="mt-4 text-lg text-cs-text-muted">
              {t('home.cta.subtitle')}
            </p>
            <div className="mt-8">
              <Link href={user ? `/${locale}/equipment` : `/${locale}/auth/register`}>
                <Button size="lg" className="w-full sm:w-auto">
                  {t('home.cta.button')}
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-cs-text-muted">
              {t('home.cta.disclaimer')}
            </p>
          </div>
        </section>
      </main>
    </>
  )
}

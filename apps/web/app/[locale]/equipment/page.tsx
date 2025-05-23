'use client'

import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@catchsmart/ui/src/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@catchsmart/ui/src/components/card'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function EquipmentPage() {
  const t = useTranslations()
  const router = useRouter()
  const { user, signOut, loading } = useAuthStore()

  // Protect the route
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-solid border-cs-primary border-r-transparent align-[-0.125em]" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('equipment.title')}</h1>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('equipment.empty.title')}</CardTitle>
          <CardDescription>
            {t('equipment.empty.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Willkommen {user.email}! Dies ist eine Platzhalter-Seite für die Equipment-Verwaltung.
          </p>
          <Button>
            {t('equipment.empty.cta')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

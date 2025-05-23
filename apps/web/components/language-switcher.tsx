'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { LanguageSwitcher as BaseLanguageSwitcher } from '@catchsmart/ui/src/components/language-switcher'
import { locales, type Locale } from '@/i18n'

export function LanguageSwitcher() {
  const t = useTranslations('common')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLocale: Locale) => {
    // Get the current path without the locale
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    
    router.push(newPath)
  }

  return (
    <BaseLanguageSwitcher
      currentLocale={locale}
      locales={locales}
      onLocaleChange={handleLanguageChange}
      label={t('selectLanguage')}
    />
  )
}

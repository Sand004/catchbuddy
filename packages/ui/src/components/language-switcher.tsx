'use client'

import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Globe } from 'lucide-react'

export type Locale = 'de' | 'en' | 'es'

const languageNames: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
}

const languageFlags: Record<Locale, string> = {
  de: '🇩🇪',
  en: '🇬🇧',
  es: '🇪🇸',
}

interface LanguageSwitcherProps {
  currentLocale: Locale
  locales: readonly Locale[]
  onLocaleChange: (locale: Locale) => void
  label?: string
}

export function LanguageSwitcher({
  currentLocale,
  locales,
  onLocaleChange,
  label = 'Select Language'
}: LanguageSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => onLocaleChange(lang)}
            className={currentLocale === lang ? 'bg-accent' : ''}
          >
            <span className="mr-2 text-lg">{languageFlags[lang]}</span>
            <span>{languageNames[lang]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const locales = ['de', 'en', 'es'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'de'

export default getRequestConfig(async ({ requestLocale }) => {
  // Use the new requestLocale parameter
  const locale = await requestLocale

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) {
    notFound()
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Europe/Berlin', // German timezone as default
    now: new Date(),
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }
      },
      number: {
        precise: {
          maximumFractionDigits: 2
        }
      }
    }
  }
})
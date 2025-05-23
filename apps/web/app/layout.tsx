import { redirect } from 'next/navigation'
import { defaultLocale } from '@/i18n'

// This layout is only used for the root path to redirect to the default locale
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The middleware should handle this redirect, but this is a fallback
  redirect(`/${defaultLocale}`)
}

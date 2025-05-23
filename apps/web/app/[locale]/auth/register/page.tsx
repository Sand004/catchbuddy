'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@catchsmart/ui/src/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@catchsmart/ui/src/components/card'
import { useAuthStore } from '@/lib/stores/auth-store'

export default function RegisterPage() {
  const t = useTranslations()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const { signUp, signInWithGoogle, signInWithApple, loading, error, initializeAuth } = useAuthStore()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    // Validation
    if (password !== confirmPassword) {
      setValidationError(t('errors.validation.passwordMatch'))
      return
    }

    if (password.length < 8) {
      setValidationError(t('errors.validation.minLength', { min: 8 }))
      return
    }

    if (!acceptTerms) {
      setValidationError('Bitte akzeptiere die AGB und Datenschutzbestimmungen')
      return
    }

    setIsSubmitting(true)
    try {
      await signUp(email, password, name)
      router.push(`/${locale}/equipment`)
    } catch (error) {
      // Error is handled in the store
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignUp = async () => {
    if (!acceptTerms) {
      setValidationError('Bitte akzeptiere die AGB und Datenschutzbestimmungen')
      return
    }
    setValidationError('')
    try {
      await signInWithGoogle()
    } catch (error) {
      // Error is handled in the store
    }
  }

  const handleAppleSignUp = async () => {
    if (!acceptTerms) {
      setValidationError('Bitte akzeptiere die AGB und Datenschutzbestimmungen')
      return
    }
    setValidationError('')
    try {
      await signInWithApple()
    } catch (error) {
      // Error is handled in the store
    }
  }

  const renderTermsText = () => {
    const termsText = t('auth.register.terms')
    return termsText.split(/(<link>.*?<\/link>)/g).map((part, index) => {
      if (part.startsWith('<link>') && part.endsWith('</link>')) {
        const linkText = part.replace(/<\/?link>/g, '')
        const isTermsLink = ['AGB', 'Terms', 'Términos'].includes(linkText)
        return (
          <Link
            key={index}
            href={isTermsLink ? `/${locale}/terms` : `/${locale}/privacy`}
            className="text-cs-primary hover:underline"
            target="_blank"
          >
            {linkText}
          </Link>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {t('auth.register.title')}
          </CardTitle>
          <CardDescription>
            {t('auth.register.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                {t('auth.register.name')}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading || isSubmitting}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Max Mustermann"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t('auth.register.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || isSubmitting}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="name@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {t('auth.register.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={loading || isSubmitting}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                {t('auth.register.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                disabled={loading || isSubmitting}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={loading || isSubmitting}
                className="h-4 w-4 rounded border-input text-cs-primary focus:ring-cs-primary mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label htmlFor="terms" className="ml-2 block text-sm">
                {renderTermsText()}
              </label>
            </div>

            {(error || validationError) && (
              <div className="rounded-lg bg-cs-error/10 p-3 text-sm text-cs-error">
                {error || validationError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={isSubmitting}
              disabled={loading || isSubmitting}
            >
              {t('auth.register.submit')}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2 text-muted-foreground">
                  {t('common.or')}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignUp}
                disabled={loading || !acceptTerms}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAppleSignUp}
                disabled={loading || !acceptTerms}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Apple
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {t('auth.register.hasAccount')}{' '}
            </span>
            <Link
              href={`/${locale}/auth/login`}
              className="text-cs-primary hover:underline font-medium"
            >
              {t('auth.register.signIn')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

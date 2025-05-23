'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()
      
      try {
        // Exchange the code for a session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href)
        
        if (exchangeError) {
          console.error('Error exchanging code for session:', exchangeError)
          router.push(`/${locale}/auth/login?error=callback_error`)
          return
        }
        
        // Get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Error getting session:', sessionError)
          router.push(`/${locale}/auth/login?error=callback_error`)
          return
        }

        if (session) {
          // Successful authentication
          router.push(`/${locale}/equipment`)
        } else {
          // No session found
          router.push(`/${locale}/auth/login`)
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error)
        router.push(`/${locale}/auth/login?error=callback_error`)
      }
    }

    handleCallback()
  }, [router, locale])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-solid border-cs-primary border-r-transparent align-[-0.125em]" />
        <p className="mt-4 text-lg">Authentifizierung läuft...</p>
      </div>
    </div>
  )
}

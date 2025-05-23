'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()
      
      // Get the code from URL
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error during auth callback:', error)
        router.push('/auth/login?error=callback_error')
        return
      }

      if (session) {
        // Successful authentication
        router.push('/equipment')
      } else {
        // No session found
        router.push('/auth/login')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-solid border-cs-primary border-r-transparent align-[-0.125em]" />
        <p className="mt-4 text-lg">Authentifizierung läuft...</p>
      </div>
    </div>
  )
}

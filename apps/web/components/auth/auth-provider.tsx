'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    const unsubscribe = initializeAuth()
    
    return () => {
      if (unsubscribe) {
        unsubscribe.then((fn) => fn?.())
      }
    }
  }, [initializeAuth])

  return <>{children}</>
}

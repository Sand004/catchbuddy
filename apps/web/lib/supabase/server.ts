// Supabase Server Client Configuration for SSR
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@catchsmart/database/types/database'
import type { CookieOptions } from '@supabase/ssr'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const allCookies = cookieStore.getAll()
          // Debug logging
          console.log('Server: Getting all cookies:', allCookies.map(c => c.name))
          return allCookies
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              console.log('Server: Setting cookie:', name)
              cookieStore.set(name, value, options as CookieOptions)
            })
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            console.log('Server: Cookie set error (expected in Server Components):', error)
          }
        },
      },
    }
  )
}

// Alternative method that's more explicit about cookie handling
export async function createAuthenticatedClient() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  
  // Find the auth token cookie - it might have the project ID in the name
  const authCookie = allCookies.find(cookie => 
    cookie.name.includes('auth-token') || 
    cookie.name === 'sb-access-token' ||
    cookie.name === 'sb-refresh-token'
  )
  
  console.log('Server: Auth cookie search:', {
    found: !!authCookie,
    cookieName: authCookie?.name,
    cookieNames: allCookies.map(c => c.name)
  })

  const client = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return allCookies
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as CookieOptions)
            )
          } catch {
            // Ignore - expected in Server Components
          }
        },
      },
    }
  )

  // Try to get the session to verify auth is working
  const { data: { session }, error } = await client.auth.getSession()
  console.log('Server: Session check:', { hasSession: !!session, error: error?.message })

  return client
}

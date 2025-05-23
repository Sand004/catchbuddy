import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@catchsmart/database/types/database'

export async function GET(request: NextRequest) {
  console.log('=== Auth Debug API ===')
  
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    console.log('All cookies:', allCookies.map(c => ({
      name: c.name,
      value: c.value ? `${c.value.substring(0, 20)}...` : 'no value',
      length: c.value?.length || 0
    })))

    // Find auth-related cookies
    const authCookies = allCookies.filter(c => 
      c.name.includes('auth') || 
      c.name.includes('sb-') ||
      c.name.includes('supabase')
    )

    // Parse the auth token if found
    let tokenData = null
    const authTokenCookie = allCookies.find(c => c.name.includes('auth-token'))
    if (authTokenCookie?.value) {
      try {
        tokenData = JSON.parse(authTokenCookie.value)
        console.log('Parsed auth token:', {
          hasAccessToken: !!tokenData.access_token,
          hasRefreshToken: !!tokenData.refresh_token,
          expiresAt: tokenData.expires_at,
          userEmail: tokenData.user?.email
        })
      } catch (e) {
        console.error('Failed to parse auth token:', e)
      }
    }

    // Create Supabase client with explicit cookie handling
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            console.log('Supabase requesting cookies, returning:', allCookies.length, 'cookies')
            return allCookies
          },
          setAll(cookiesToSet) {
            console.log('Supabase wants to set cookies:', cookiesToSet.map(c => c.name))
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (error) {
              console.log('Cookie set error (expected):', error)
            }
          },
        },
      }
    )

    // Try different auth methods
    console.log('Attempting getSession()...')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    console.log('Attempting getUser()...')
    const { data: userData, error: userError } = await supabase.auth.getUser()

    // If we have a token but no session, try to set it manually
    let manualAuthResult = null
    if (tokenData?.access_token && !sessionData.session) {
      console.log('Attempting manual session restore...')
      const { data: manualSession, error: manualError } = await supabase.auth.setSession({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token
      })
      manualAuthResult = { success: !!manualSession, error: manualError?.message }
    }

    return NextResponse.json({
      debug: {
        cookieCount: allCookies.length,
        authCookies: authCookies.map(c => c.name),
        hasAuthToken: !!authTokenCookie,
        parsedToken: tokenData ? {
          hasAccessToken: !!tokenData.access_token,
          hasRefreshToken: !!tokenData.refresh_token,
          userEmail: tokenData.user?.email,
          expiresAt: tokenData.expires_at
        } : null
      },
      session: {
        hasSession: !!sessionData.session,
        error: sessionError?.message,
        userId: sessionData.session?.user?.id,
        email: sessionData.session?.user?.email
      },
      user: {
        hasUser: !!userData.user,
        error: userError?.message,
        userId: userData.user?.id,
        email: userData.user?.email
      },
      manualAuth: manualAuthResult,
      env: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }
    })
  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

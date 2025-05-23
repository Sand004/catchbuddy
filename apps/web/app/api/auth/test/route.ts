import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@catchsmart/database/types/database'

export async function GET(request: NextRequest) {
  console.log('=== Auth Test API called ===')
  
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    console.log('Available cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })))
    
    const supabase = createServerClient<Database>(
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
                cookieStore.set(name, value, options)
              )
            } catch (error) {
              console.log('Cookie set error (can be ignored):', error)
            }
          },
        },
      }
    )
    
    // Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json({
        authenticated: false,
        error: sessionError?.message || 'No session found',
        cookies: allCookies.map(c => c.name),
        env: {
          hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        }
      }, { status: 401 })
    }

    // Check storage bucket
    const { data: buckets } = await supabase.storage.listBuckets()
    const hasEquipmentBucket = buckets?.some(b => b.name === 'equipment-images')

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
      },
      storage: {
        hasEquipmentBucket,
        buckets: buckets?.map(b => b.name) || []
      },
      env: {
        hasGoogleKey: !!process.env.GOOGLE_CLOUD_API_KEY && process.env.GOOGLE_CLOUD_API_KEY !== 'your-google-cloud-api-key',
        hasBraveKey: !!process.env.BRAVE_SEARCH_API_KEY && process.env.BRAVE_SEARCH_API_KEY !== 'your-brave-api-key',
      }
    })
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

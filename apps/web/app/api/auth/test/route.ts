import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  console.log('=== Auth Test API called ===')
  
  try {
    // Use the standard createClient which handles cookies properly
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({
        authenticated: false,
        error: userError?.message || 'No user found',
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
        id: user.id,
        email: user.email,
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

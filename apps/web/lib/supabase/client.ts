// Supabase Client Configuration for Browser
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@catchsmart/database/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

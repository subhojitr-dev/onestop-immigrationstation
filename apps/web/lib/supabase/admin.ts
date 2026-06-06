/**
 * lib/supabase/admin.ts
 *
 * Supabase ADMIN client — uses the service role key which bypasses
 * Row Level Security entirely. Only use this in server components
 * inside the /admin section where we need to read ALL users' data.
 *
 * NEVER use this client in client components or expose it to the browser.
 * NEVER use NEXT_PUBLIC_ prefix for the service role key.
 *
 * Usage:
 *   import { createAdminClient } from '@/lib/supabase/admin'
 *   const supabase = createAdminClient()
 *   const { data } = await supabase.from('appointments').select('*') // reads ALL rows
 */
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

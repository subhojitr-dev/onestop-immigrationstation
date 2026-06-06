/**
 * middleware.ts
 *
 * Next.js Edge Middleware — runs on every request before the page renders.
 *
 * Two jobs:
 *   1. Session refresh: calls supabase.auth.getUser() which silently refreshes
 *      expired access tokens using the refresh token stored in cookies.
 *      Without this, users would be logged out whenever their JWT expires (~1 hour).
 *
 *   2. Route protection: if the request path starts with /dashboard (or other
 *      protected paths) and no valid session exists, redirect to /login.
 *      The original path is passed as ?redirectTo= so the login page can
 *      send the user back to where they were after signing in.
 *
 * Important: The `supabaseResponse` must be returned (not a plain NextResponse.next())
 * so that any updated auth cookies set by Supabase are forwarded to the browser.
 * This is the pattern required by @supabase/ssr — don't simplify it.
 *
 * The `matcher` config excludes static files and images from middleware execution
 * for performance — only HTML page requests need the auth check.
 *
 * Note: /admin/* routes are NOT in the protectedPaths list here because
 * app/admin/layout.tsx handles admin-specific role checks (lawyer/admin only).
 */
// ============================================================
// Next.js Middleware — handles auth session refresh
// Runs on every request before the page loads
// ============================================================
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes — redirect to login if not authenticated
  const protectedPaths = ['/dashboard', '/cases', '/appointments', '/documents', '/profile']
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

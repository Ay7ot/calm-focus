import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Check if user is banned
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_banned, banned_until')
      .eq('id', user.id)
      .single()

    if (profile?.is_banned) {
      // Check if ban has expired (for temporary bans)
      if (profile.banned_until) {
        const banExpiry = new Date(profile.banned_until)
        const now = new Date()

        if (now >= banExpiry) {
          // Ban has expired - automatically unban the user
          await supabase
            .from('profiles')
            .update({ 
              is_banned: false,
              ban_reason: null,
              banned_until: null,
              banned_by: null
            })
            .eq('id', user.id)

          // Allow the user to continue
          return response
        }
      }

      // User is still banned - sign them out and redirect to banned page
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/banned', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - login, signup, banned pages (allow access)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|login|signup|banned).*)',
  ],
}

import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Protect all /admin-panel routes except /admin-panel/login
  if (pathname.startsWith('/admin-panel') && pathname !== '/admin-panel/login') {
    if (!isLoggedIn) {
      const loginUrl = new URL('/admin-panel/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Protect all /api/admin routes
  if (pathname.startsWith('/api/admin')) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 })
    }
  }

  // Redirect authenticated users away from login
  if (pathname === '/admin-panel/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin-panel', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/admin-panel/:path*',
    '/api/admin/:path*',
  ],
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_AUTH_COOKIE, getAdminTokenFromRequest, verifyAdminToken } from '@/lib/auth'

const PRIMARY_HOST = 'jujewelry.com'
const WWW_HOST = 'www.jujewelry.com'
const ADMIN_HOST = 'admin.jujewelry.com'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const hostname = request.headers.get('host')?.split(':')[0]?.toLowerCase()

  if (hostname === WWW_HOST) {
    const url = request.nextUrl.clone()
    url.hostname = PRIMARY_HOST
    return NextResponse.redirect(url, 308)
  }

  if (hostname === ADMIN_HOST && !pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    url.search = ''
    return NextResponse.redirect(url, 308)
  }

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const token = getAdminTokenFromRequest(request)
  if (!token) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const session = await verifyAdminToken(token)
  if (!session) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    loginUrl.searchParams.set('next', pathname)

    const response = NextResponse.redirect(loginUrl)
    response.cookies.set({
      name: ADMIN_AUTH_COOKIE,
      value: '',
      path: '/',
      maxAge: 0,
      httpOnly: true,
      sameSite: 'lax',
    })

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|apple-icon.png|og-image.png|manifest.webmanifest|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_AUTH_COOKIE, getAdminTokenFromRequest, verifyAdminToken } from '@/lib/auth'

const PRIMARY_HOST = 'jujewelry.com'
const WWW_HOST = 'www.jujewelry.com'
const ADMIN_HOST = 'admin.jujewelry.com'
const CUSTOM_HOSTS = new Set([PRIMARY_HOST, WWW_HOST, ADMIN_HOST])
const NAVER_VERIFICATION_PATH = '/naver4991e0926ac790ff8c67f8c44df2840e.html'
const NAVER_VERIFICATION_CONTENT =
  'naver-site-verification: naver4991e0926ac790ff8c67f8c44df2840e.html\n'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const hostname = request.headers.get('host')?.split(':')[0]?.toLowerCase()
  const isHttpRequest =
    request.nextUrl.protocol === 'http:' || request.headers.get('x-forwarded-proto') === 'http'

  if (hostname && CUSTOM_HOSTS.has(hostname) && isHttpRequest) {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'

    if (hostname === WWW_HOST) {
      url.hostname = PRIMARY_HOST
    }

    if (hostname === ADMIN_HOST && !pathname.startsWith('/admin')) {
      url.pathname = '/admin'
      url.search = ''
    }

    return NextResponse.redirect(url, 308)
  }

  if (pathname === NAVER_VERIFICATION_PATH) {
    return new NextResponse(request.method === 'HEAD' ? null : NAVER_VERIFICATION_CONTENT, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=300',
      },
    })
  }

  if (hostname === WWW_HOST) {
    const url = request.nextUrl.clone()
    url.hostname = PRIMARY_HOST
    url.protocol = 'https:'
    return NextResponse.redirect(url, 308)
  }

  if (hostname === ADMIN_HOST && !pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
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
    '/naver4991e0926ac790ff8c67f8c44df2840e.html',
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|apple-icon.png|og-image.png|manifest.webmanifest|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}

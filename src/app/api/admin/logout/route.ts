import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url))
  response.headers.set('Set-Cookie', clearAuthCookie())
  return response
}

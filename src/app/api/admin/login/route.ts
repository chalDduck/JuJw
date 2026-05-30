
import { NextResponse } from 'next/server'
import {
  clearAuthCookie,
  createAdminToken,
  createAuthCookie,
  verifyAdminCredentials,
} from '@/lib/auth'
import { jsonError } from '@/lib/api'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0]?.trim() || 'unknown' : 'unknown'
  const limiter = rateLimit({
    key: `admin-login:${ip}`,
    max: 5,
    windowMs: 10 * 60 * 1000,
  })

  if (!limiter.allowed) {
    return jsonError('로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.', 429)
  }

  let payload: { email?: string; password?: string }

  try {
    payload = await request.json()
  } catch {
    return jsonError('잘못된 요청 본문입니다.', 400)
  }

  const email = payload.email?.trim().toLowerCase() || ''
  const password = payload.password?.trim() || ''

  if (!email || !password) {
    return jsonError('아이디와 비밀번호를 입력해 주세요.', 400)
  }

  const admin = await verifyAdminCredentials(email, password)
  if (!admin) {
    return jsonError('로그인 정보가 올바르지 않습니다.', 401)
  }

  const token = await createAdminToken(admin)
  const response = NextResponse.json({
    ok: true,
    admin,
  })

  response.headers.set('Set-Cookie', createAuthCookie(token))
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.headers.set('Set-Cookie', clearAuthCookie())
  return response
}

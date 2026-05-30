
import { NextResponse } from 'next/server'
import { createInquiry } from '@/lib/db'
import { jsonError } from '@/lib/api'
import { rateLimit } from '@/lib/rate-limit'

function getClientIp(request: Request): string {
  const header = request.headers.get('x-forwarded-for')
  if (header) {
    return header.split(',')[0]?.trim() || 'unknown'
  }
  return 'unknown'
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const limiter = rateLimit({
    key: `inquiry:${ip}`,
    max: 5,
    windowMs: 10 * 60 * 1000,
  })

  if (!limiter.allowed) {
    return jsonError('요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.', 429)
  }

  let payload: {
    companyName?: string
    phone?: string
    interest?: string
    message?: string
    website?: string
    privacyConsent?: boolean
  }

  try {
    payload = await request.json()
  } catch {
    return jsonError('잘못된 요청 본문입니다.', 400)
  }

  // honeypot
  if (payload.website && payload.website.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  if (payload.privacyConsent !== true) {
    return jsonError('개인정보 수집 및 이용에 동의해 주세요.', 400)
  }

  const companyName = payload.companyName?.trim() || ''
  const phone = payload.phone?.trim() || ''

  if (!companyName || !phone) {
    return jsonError('이름과 연락처는 필수입니다.', 400)
  }

  try {
    const inquiry = await createInquiry({
      companyName,
      phone,
      interest: payload.interest?.trim() || null,
      message: payload.message?.trim() || null,
      ipAddress: ip,
    })

    return NextResponse.json({
      ok: true,
      inquiry,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '문의 저장 중 오류가 발생했습니다.'
    return jsonError(message, 500)
  }
}

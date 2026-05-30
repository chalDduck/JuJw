import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAdminSessionFromRequest } from '@/lib/auth'

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export async function requireAdmin(request: Request | NextRequest) {
  const session = await getAdminSessionFromRequest(request)
  if (!session) {
    return {
      ok: false as const,
      response: jsonError('Unauthorized', 401),
    }
  }

  return {
    ok: true as const,
    session,
  }
}

export function createSlug(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    // 영문/숫자/한글(가-힣)/공백/하이픈만 남깁니다 (한글 제품명도 슬러그가 비지 않도록)
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  // 슬러그가 비면(특수문자만 입력 등) 시간 기반 대체값 사용
  return base || `item-${Date.now().toString(36)}`
}


import { NextResponse } from 'next/server'
import { jsonError, requireAdmin } from '@/lib/api'
import { createNotice, getNotices } from '@/lib/db'

export async function GET(request: Request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  const notices = await getNotices()
  return NextResponse.json({ notices })
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  let payload: {
    title?: string
    content?: string
    isPublished?: boolean
    isPinned?: boolean
  }

  try {
    payload = await request.json()
  } catch {
    return jsonError('잘못된 요청 본문입니다.', 400)
  }

  const title = payload.title?.trim() || ''
  const content = payload.content?.trim() || ''

  if (!title || !content) {
    return jsonError('제목과 내용은 필수입니다.', 400)
  }

  const notice = await createNotice({
    title,
    content,
    isPublished: payload.isPublished ?? true,
    isPinned: payload.isPinned ?? false,
  })

  return NextResponse.json({ ok: true, notice })
}

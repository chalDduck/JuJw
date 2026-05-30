
import { NextResponse } from 'next/server'
import { jsonError, requireAdmin } from '@/lib/api'
import { deleteNotice, updateNotice } from '@/lib/db'

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  const id = Number(context.params.id)
  if (!id) {
    return jsonError('잘못된 공지 ID입니다.', 400)
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

  const notice = await updateNotice(id, {
    title,
    content,
    isPublished: payload.isPublished ?? true,
    isPinned: payload.isPinned ?? false,
  })

  if (!notice) {
    return jsonError('공지를 찾을 수 없습니다.', 404)
  }

  return NextResponse.json({ ok: true, notice })
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  const id = Number(context.params.id)
  if (!id) {
    return jsonError('잘못된 공지 ID입니다.', 400)
  }

  const ok = await deleteNotice(id)
  if (!ok) {
    return jsonError('공지를 찾을 수 없습니다.', 404)
  }

  return NextResponse.json({ ok: true })
}

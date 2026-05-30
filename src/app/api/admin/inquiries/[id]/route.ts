
import { NextResponse } from 'next/server'
import { jsonError, requireAdmin } from '@/lib/api'
import { updateInquiryStatus } from '@/lib/db'
import type { InquiryStatus } from '@/lib/models'

const ALLOWED_STATUS: InquiryStatus[] = ['pending', 'contacted', 'completed']

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  const id = Number(context.params.id)
  if (!id) {
    return jsonError('잘못된 문의 ID입니다.', 400)
  }

  let payload: { status?: InquiryStatus }
  try {
    payload = await request.json()
  } catch {
    return jsonError('잘못된 요청 본문입니다.', 400)
  }

  if (!payload.status || !ALLOWED_STATUS.includes(payload.status)) {
    return jsonError('유효하지 않은 상태값입니다.', 400)
  }

  const inquiry = await updateInquiryStatus(id, payload.status)
  if (!inquiry) {
    return jsonError('문의를 찾을 수 없습니다.', 404)
  }

  return NextResponse.json({ ok: true, inquiry })
}

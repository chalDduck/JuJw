
import { NextResponse } from 'next/server'
import { jsonError, requireAdmin } from '@/lib/api'
import { getAllSettings, upsertSettings } from '@/lib/db'

export async function GET(request: Request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  const settings = await getAllSettings()
  return NextResponse.json({ settings })
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  let payload: { settings?: Record<string, string> }
  try {
    payload = await request.json()
  } catch {
    return jsonError('잘못된 요청 본문입니다.', 400)
  }

  if (!payload.settings || typeof payload.settings !== 'object') {
    return jsonError('settings 객체가 필요합니다.', 400)
  }

  const sanitizedEntries = Object.entries(payload.settings).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (!key) return acc
      acc[key] = String(value ?? '')
      return acc
    },
    {}
  )

  await upsertSettings(sanitizedEntries)
  const settings = await getAllSettings()

  return NextResponse.json({ ok: true, settings })
}

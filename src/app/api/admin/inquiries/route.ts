
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api'
import { getInquiries } from '@/lib/db'

export async function GET(request: Request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  const inquiries = await getInquiries()
  return NextResponse.json({ inquiries })
}

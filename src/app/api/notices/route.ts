
import { NextResponse } from 'next/server'
import { getNotices } from '@/lib/public-data'

export const dynamic = 'force-dynamic'

export async function GET() {
  const notices = await getNotices({ publishedOnly: true })
  return NextResponse.json({ notices })
}

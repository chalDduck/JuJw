import type { Metadata } from 'next'
import { getPublicSettings } from '@/lib/db'
import { normalizeSiteSettings } from '@/lib/site-settings'
import ContactView from '@/components/contact/ContactView'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '상담 문의',
  description: '제품, 거래 조건, 방문 상담 문의를 남겨주시면 영업일 기준 24시간 내 연락드립니다.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
  const settings = normalizeSiteSettings(await getPublicSettings())
  return <ContactView settings={settings} />
}

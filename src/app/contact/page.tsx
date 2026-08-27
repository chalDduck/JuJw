import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import { getPublicSettings } from '@/lib/public-data'
import { normalizeSiteSettings } from '@/lib/site-settings'
import { buildPageMetadata } from '@/lib/metadata'
import ContactView from '@/components/contact/ContactView'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildPageMetadata({
  title: '상담 문의',
  description: '제품, 거래 조건, 방문 상담 문의를 남겨주시면 영업일 기준 24시간 내 연락드립니다.',
  path: '/contact',
  image: '/img/location-generated/location-cta-panel.png',
  imageAlt: 'JU JEWELRY 상담 문의',
})

export default async function ContactPage() {
  const settings = normalizeSiteSettings(await getPublicSettings())
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: '홈', path: '/' }, { name: '상담 문의', path: '/contact' }]} />
      <ContactView settings={settings} />
    </>
  )
}

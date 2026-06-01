import type { Metadata } from 'next'
import LocationVisitPage from '@/components/location/LocationVisitPage'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import JsonLd from '@/components/seo/JsonLd'
import { getPublicSettings } from '@/lib/db'
import { normalizeSiteSettings } from '@/lib/site-settings'
import { buildPageMetadata } from '@/lib/metadata'
import { buildJewelryStoreJsonLd } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildPageMetadata({
  title: '오시는 길',
  description: '주소, 운영시간, 지도 이동, 방문 예약까지 JU JEWELRY 방문 정보를 한 번에 확인할 수 있습니다.',
  path: '/location',
  image: '/img/ju-store/ju-store-hero-desktop.jpg',
  imageAlt: 'JU JEWELRY 매장 전경',
})

export default async function LocationPage() {
  const settings = normalizeSiteSettings(await getPublicSettings())

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: '홈', path: '/' }, { name: '오시는 길', path: '/location' }]} />
      <JsonLd id="location-jewelry-store-jsonld" data={buildJewelryStoreJsonLd(settings)} />
      <LocationVisitPage settings={settings} />
    </>
  )
}

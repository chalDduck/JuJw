import type { Metadata } from 'next'
import LocationVisitPage from '@/components/location/LocationVisitPage'
import { getPublicSettings } from '@/lib/db'
import { normalizeSiteSettings } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '오시는 길',
  description: '주소, 운영시간, 지도 이동, 방문 예약까지 JU JEWELRY 방문 정보를 한 번에 확인할 수 있습니다.',
}

export default async function LocationPage() {
  const settings = normalizeSiteSettings(await getPublicSettings())

  return <LocationVisitPage settings={settings} />
}

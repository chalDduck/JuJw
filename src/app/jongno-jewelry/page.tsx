import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: '종로 귀금속 도매',
  description: '종로 귀금속 상권에서 신뢰할 수 있는 주얼리 도매 파트너 JU JEWELRY',
  path: '/jongno-jewelry',
  image: '/img/location-generated/location-hero-desktop.png',
  imageAlt: '종로 귀금속 도매 JU JEWELRY',
})

export default function JongnoJewelryPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: '홈', path: '/' }, { name: '종로 귀금속 도매', path: '/jongno-jewelry' }]}
      />
      <LandingLayout
        title="종로 귀금속 도매"
        description="종로 상권 기반의 빠른 상담/출고 프로세스로 안정적인 거래를 지원합니다."
        points={[
          '종로 귀금속 상권 네트워크 기반 소싱',
          '반지/목걸이/귀걸이/팔찌 카테고리 운영',
          '소량 주문부터 맞춤 제작까지 유연 대응',
        ]}
      />
    </>
  )
}

function LandingLayout({
  title,
  description,
  points,
}: {
  title: string
  description: string
  points: string[]
}) {
  return (
    <div className="public-page-shell min-h-screen bg-[#f7f2eb] text-[#33261f]">
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 md:px-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#a77c52]">Wholesale</p>
        <h1 className="mt-4 text-[2.1rem] font-semibold leading-[1.2] tracking-[-0.04em] text-[#2f241d] sm:text-[3rem]">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#6b5c4f]">{description}</p>
        <ul className="mt-10 divide-y divide-[#dfd0bf] border-y border-[#dfd0bf] text-[14px] leading-7 text-[#6b5c4f]">
          {points.map((point) => (
            <li key={point} className="flex gap-3 py-4">
              <span className="mt-[0.85rem] h-px w-5 shrink-0 bg-[#b79776]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/products" className="inline-flex min-h-[48px] items-center justify-center bg-[#3d2d24] px-5 text-sm text-white">
            제품 보기
          </Link>
          <Link href="/contact" className="inline-flex min-h-[48px] items-center justify-center border border-[#cdbba8] px-5 text-sm text-[#3d2d24]">
            상담 문의
          </Link>
        </div>
      </section>
    </div>
  )
}

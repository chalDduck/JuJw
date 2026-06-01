import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: '구매 가이드',
  description: '반지 사이즈, 금속 종류, 보증서 확인 등 주얼리 구매 가이드',
  path: '/guide',
  image: '/img/products-generated/products-service-gift.png',
  imageAlt: 'JU JEWELRY 구매 가이드',
})

export default function GuidePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: '홈', path: '/' }, { name: '구매 가이드', path: '/guide' }]} />
      <div className="min-h-screen bg-[#f7f2eb] text-[#33261f]">
        <section className="public-hero px-4 sm:px-6 md:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#a77c52]">Guide</p>
            <h1 className="mt-4 text-[2.1rem] font-semibold leading-[1.2] tracking-[-0.04em] text-[#2f241d] sm:text-[3rem]">
              구매 가이드
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#6b5c4f]">
              거래 전에 자주 확인하시는 핵심 포인트를 정리했습니다.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl divide-y divide-[#dfd0bf] border-y border-[#dfd0bf] px-4 py-0 sm:px-6 md:px-8">
          <GuideCard
            title="반지 사이즈 측정"
            items={[
              '종이 스트립 또는 링 게이지로 손가락 둘레를 측정합니다.',
              '오후 시간대에 측정하면 보다 실제 착용감에 가깝습니다.',
              '마디가 굵은 경우 마디 기준으로 사이즈를 잡아주세요.',
            ]}
          />
          <GuideCard
            title="금속 종류 비교"
            items={[
              '14K: 강도와 가격 균형이 좋아 데일리 착용에 적합합니다.',
              '18K: 색감이 깊고 고급스러운 톤을 선호할 때 적합합니다.',
              'Pt(플래티넘): 백색 광택과 내구성을 중요하게 볼 때 선택합니다.',
            ]}
          />
          <GuideCard
            title="보증서 확인 포인트"
            items={[
              '스톤 중량(ct), 컬러/클래리티 등급을 확인합니다.',
              '금속 함량(14K/18K/Pt)과 제조 정보를 확인합니다.',
              '판매처 연락처, A/S 조건, 교환 정책을 함께 보관해 주세요.',
            ]}
          />
        </section>
      </div>
    </>
  )
}

function GuideCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="grid gap-4 py-7 md:grid-cols-[0.34fr_0.66fr] md:gap-8">
      <h2 className="text-[1.25rem] font-semibold leading-8 text-[#2f241d]">{title}</h2>
      <ul className="space-y-3 text-[14px] leading-7 text-[#6b5c4f]">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-[0.72rem] h-px w-5 shrink-0 bg-[#b79776]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: '예물 반지 도매',
  description: '웨딩/예물 반지 도매 상담, 맞춤 제작 대응, 종로 기반 빠른 리드타임',
  path: '/wholesale-wedding-ring',
})

export default function WholesaleWeddingRingPage() {
  return (
    <div className="public-page-shell min-h-screen bg-[#f7f2eb] text-[#33261f]">
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 md:px-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#a77c52]">Wholesale</p>
        <h1 className="mt-4 text-[2.1rem] font-semibold leading-[1.2] tracking-[-0.04em] text-[#2f241d] sm:text-[3rem]">
          예물 반지 도매
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#6b5c4f]">
          웨딩 수요에 맞춘 솔리테어, 밴드, 커플링 라인업을 운영합니다.
          스톤 스펙/금속 함량/납기 기준으로 빠르게 상담해 드립니다.
        </p>
        <ul className="mt-10 divide-y divide-[#dfd0bf] border-y border-[#dfd0bf] text-[14px] leading-7 text-[#6b5c4f]">
          {['14K/18K/Pt 맞춤 옵션 지원', '매장/온라인 판매처별 구성 제안', '맞춤 제작 리드타임 7-14일'].map((point) => (
            <li key={point} className="flex gap-3 py-4">
              <span className="mt-[0.85rem] h-px w-5 shrink-0 bg-[#b79776]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/products/rings" className="inline-flex min-h-[48px] items-center justify-center bg-[#3d2d24] px-5 text-sm text-white">
            반지 라인업 보기
          </Link>
          <Link href="/contact" className="inline-flex min-h-[48px] items-center justify-center border border-[#cdbba8] px-5 text-sm text-[#3d2d24]">
            도매 상담 요청
          </Link>
        </div>
      </section>
    </div>
  )
}

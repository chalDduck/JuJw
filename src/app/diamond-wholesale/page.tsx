import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: '다이아몬드 도매',
  description: '다이아몬드 중심 제품군 도매 상담 및 스펙 기반 거래 안내',
  path: '/diamond-wholesale',
})

export default function DiamondWholesalePage() {
  return (
    <div className="public-page-shell min-h-screen bg-[#f7f2eb] text-[#33261f]">
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 md:px-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#a77c52]">Wholesale</p>
        <h1 className="mt-4 text-[2.1rem] font-semibold leading-[1.2] tracking-[-0.04em] text-[#2f241d] sm:text-[3rem]">
          다이아몬드 도매
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#6b5c4f]">
          솔리테어, 테니스, 스터드 등 다이아몬드 중심 제품을 거래처 성격에 맞춰 제안합니다.
          스펙/가격대/납기 기준으로 빠르게 비교 견적을 제공합니다.
        </p>
        <ul className="mt-10 divide-y divide-[#dfd0bf] border-y border-[#dfd0bf] text-[14px] leading-7 text-[#6b5c4f]">
          {['거래 조건별 라인업 큐레이션', '카탈로그/샘플 기반 상담 가능', 'A/S 및 사후 관리 프로세스 제공'].map((point) => (
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
            견적 문의
          </Link>
        </div>
      </section>
    </div>
  )
}

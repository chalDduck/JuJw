import type { Metadata } from 'next'
import { getPublicSettings } from '@/lib/public-data'
import { normalizeSiteSettings } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '이용약관',
  description: 'JU JEWELRY 사이트 이용 및 상담 거래 안내 약관',
  alternates: {
    canonical: '/terms',
  },
}

export default async function TermsPage() {
  const settings = normalizeSiteSettings(await getPublicSettings())

  return (
    <div className="public-page-shell min-h-screen bg-[#f7f2eb] text-[#33261f]">
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 md:px-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#a77c52]">Terms</p>
        <h1 className="mt-4 text-[2.1rem] font-semibold leading-[1.2] tracking-[-0.04em] text-[#2f241d] sm:text-[3rem]">
          이용약관
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#6b5c4f]">
          본 약관은 {settings.businessName || settings.shopName}이 운영하는 웹사이트 및 상담 서비스 이용 조건을 규정합니다.
        </p>

        <div className="mt-10 divide-y divide-[#dfd0bf] border-y border-[#dfd0bf] text-[14px] leading-7 text-[#6b5c4f]">
          <section className="py-6">
            <h2 className="text-[16px] font-semibold text-[#2f241d]">1. 서비스 범위</h2>
            <p>
              본 사이트는 주얼리 제품 소개, 상담 문의 접수, 공지 안내를 위한 서비스입니다. 실제 거래 조건, 납기, 재고, 견적은 별도 상담을 통해 확정됩니다.
            </p>
          </section>

          <section className="py-6">
            <h2 className="text-[16px] font-semibold text-[#2f241d]">2. 상담 및 견적</h2>
            <p>
              문의 폼 또는 유선 상담으로 접수된 내용은 담당자가 확인 후 순차 응대합니다. 게시된 제품 정보는 대표 예시일 수 있으며, 실제 재고 및 단가는 상담 시점 기준으로 안내됩니다.
            </p>
          </section>

          <section className="py-6">
            <h2 className="text-[16px] font-semibold text-[#2f241d]">3. 주문 및 납기</h2>
            <p>
              주문 제작 또는 대량 발주는 제품 사양, 수량, 금 시세, 원자재 수급에 따라 납기가 달라질 수 있습니다. 확정 일정은 별도 견적 또는 발주 확인 단계에서 안내합니다.
            </p>
          </section>

          <section className="py-6">
            <h2 className="text-[16px] font-semibold text-[#2f241d]">4. 검수 및 변경</h2>
            <p>
              맞춤 제작 또는 주문 확정 이후 사양 변경이 필요한 경우 추가 비용이나 일정 조정이 발생할 수 있습니다. 제품 하자 또는 오배송 이슈는 상담을 통해 확인 후 처리합니다.
            </p>
          </section>

          <section className="py-6">
            <h2 className="text-[16px] font-semibold text-[#2f241d]">5. 지식재산 및 책임 제한</h2>
            <p>
              사이트 내 텍스트, 이미지, 레이아웃 등은 운영자 또는 정당한 권리자의 자산입니다. 운영자는 천재지변, 외부 서비스 장애, 통신 문제 등 불가항력 사유로 발생한 손해에 대해 책임을 제한할 수 있습니다.
            </p>
          </section>

          <section className="py-6">
            <h2 className="text-[16px] font-semibold text-[#2f241d]">6. 문의처</h2>
            <p>
              연락처: {settings.phonePrimary || '-'} / {settings.email || '-'}
            </p>
            <p>주소: {settings.address || '-'}</p>
          </section>
        </div>
      </section>
    </div>
  )
}

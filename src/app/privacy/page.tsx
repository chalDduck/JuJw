import type { Metadata } from 'next'
import { getPublicSettings } from '@/lib/public-data'
import { normalizeSiteSettings } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: 'JU JEWELRY 문의폼 개인정보 수집 및 이용 안내',
  alternates: {
    canonical: '/privacy',
  },
}

export default async function PrivacyPage() {
  const settings = normalizeSiteSettings(await getPublicSettings())

  return (
    <div className="public-page-shell min-h-screen bg-[#f7f2eb] text-[#33261f]">
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 md:px-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#a77c52]">Privacy</p>
        <h1 className="mt-4 text-[2.1rem] font-semibold leading-[1.2] tracking-[-0.04em] text-[#2f241d] sm:text-[3rem]">
          개인정보처리방침
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#6b5c4f]">
          {settings.businessName || settings.shopName}은 상담 문의와 거래 안내를 위해 최소한의 개인정보를 수집하고 안전하게 관리합니다.
        </p>
        <div className="mt-10 divide-y divide-[#dfd0bf] border-y border-[#dfd0bf] text-[14px] leading-7 text-[#6b5c4f]">
          <section className="py-6">
            <h2 className="text-[16px] font-semibold text-[#2f241d]">1. 수집 항목</h2>
            <p>
              상담 문의 시 상호 또는 성함, 연락처, 관심 품목, 문의 내용, 접속 기록 일부(IP 등)를 수집할 수 있습니다.
            </p>
          </section>

          <section className="py-6">
            <h2 className="text-[16px] font-semibold text-[#2f241d]">2. 수집 목적</h2>
            <p>
              상담 응대, 제품 및 거래 안내, 견적 회신, 고객 문의 처리, 서비스 운영 안정화 목적에 한해 개인정보를 처리합니다.
            </p>
          </section>

          <section className="py-6">
            <h2 className="text-[16px] font-semibold text-[#2f241d]">3. 보유 기간</h2>
            <p>
              상담 목적 달성 후 관련 법령에 따라 보관이 필요한 경우를 제외하고 지체 없이 파기합니다. 반복 거래 이력이 필요한 경우에는 사전 고지한 범위 내에서만 보관합니다.
            </p>
          </section>

          <section className="py-6">
            <h2 className="text-[16px] font-semibold text-[#2f241d]">4. 제3자 제공</h2>
            <p>
              원칙적으로 개인정보를 외부에 제공하지 않으며, 법령에 근거가 있는 경우에만 예외로 합니다.
            </p>
          </section>

          <section className="py-6">
            <h2 className="text-[16px] font-semibold text-[#2f241d]">5. 이용자 권리</h2>
            <p>
              이용자는 언제든 본인 개인정보의 열람, 정정, 삭제, 처리 정지를 요청할 수 있으며, 접수된 요청은 법령에 따라 확인 후 처리됩니다.
            </p>
          </section>

          <section className="py-6">
            <h2 className="text-[16px] font-semibold text-[#2f241d]">6. 문의처</h2>
            <p>상호: {settings.businessName || settings.shopName}</p>
            {settings.representativeName ? <p>대표자: {settings.representativeName}</p> : null}
            {settings.businessNumber ? <p>사업자등록번호: {settings.businessNumber}</p> : null}
            <p>
              개인정보 관련 문의: {settings.email || '-'} / {settings.phonePrimary || '-'}
            </p>
            <p>주소: {settings.address || '-'}</p>
          </section>
        </div>
      </section>
    </div>
  )
}

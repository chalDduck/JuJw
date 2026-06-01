'use client'

import { useState } from 'react'
import type { SiteSettings } from '@/lib/site-settings'

const interestOptions = [
  { value: '', label: '선택해 주세요' },
  { value: 'rings', label: '반지' },
  { value: 'necklaces', label: '목걸이' },
  { value: 'earrings', label: '귀걸이' },
  { value: 'bracelets', label: '팔찌' },
  { value: 'accessories', label: '액세서리' },
  { value: 'custom', label: '맞춤 제작' },
  { value: 'catalog', label: '카탈로그 요청' },
  { value: 'other', label: '기타' },
]

type InquiryForm = {
  companyName: string
  phone: string
  interest: string
  message: string
  website: string
  privacyConsent: boolean
}

const initialForm: InquiryForm = {
  companyName: '',
  phone: '',
  interest: '',
  message: '',
  website: '',
  privacyConsent: false,
}

export default function ContactView({ settings }: { settings: SiteSettings }) {
  const [formData, setFormData] = useState<InquiryForm>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.privacyConsent) {
      setError('개인정보 수집 및 이용에 동의해 주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const payload = (await response.json()) as { error?: string }
      if (!response.ok) {
        throw new Error(payload.error || '상담 요청 저장에 실패했습니다.')
      }

      setFormData(initialForm)
      setSuccess('상담 요청이 접수되었습니다. 영업일 기준 24시간 내 연락드리겠습니다.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '문의 접수 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    { label: 'Phone', value: [settings.phonePrimary, settings.phoneSecondary].filter(Boolean).join(' / ') },
    { label: 'Email', value: settings.email },
    { label: 'Address', value: settings.address },
    { label: 'Hours', value: [settings.businessHours, settings.closedDay].filter(Boolean).join(' / ') },
  ].filter((item) => item.value)

  return (
    <div className="min-h-screen bg-[#f7f2eb] text-[#33261f]">
      <section className="public-hero px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-[#a77c52]">Contact</p>
          <h1 className="text-[2.2rem] font-semibold leading-[1.18] tracking-[-0.04em] text-[#2f241d] sm:text-[3.25rem] md:text-[4.1rem]">
            상담 문의
          </h1>
          <div className="mt-6 h-px w-16 bg-[#d4b897]" />
          <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-[#6b5c4f] sm:text-[16px]">
            제품, 거래 조건, 방문 상담에 필요한 내용을 남겨주시면 확인 후 연락드리겠습니다.
          </p>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 sm:pb-16 md:px-8 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-9 border-y border-[#dfd0bf] py-8 sm:py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-14">
            <div className="flex flex-col justify-center">
              <h2 className="mb-6 text-[1.6rem] font-semibold tracking-[-0.03em] text-[#2f241d] sm:mb-8 sm:text-[2.2rem]">
                연락처 안내
              </h2>

              <div className="mb-8 divide-y divide-[#dfd0bf] sm:mb-10">
                {contactInfo.map((item) => (
                  <div key={item.label} className="py-5 first:pt-0">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-[#a77c52]">{item.label}</p>
                    <p className="text-[15px] leading-7 text-[#33261f] sm:text-[16px]">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#dfd0bf] pt-6">
                <p className="text-[14px] leading-7 text-[#6b5c4f]">
                  영업시간 내 문의 주시면 당일 연락드리며, 영업시간 외 문의는 다음 영업일에 순차적으로 연락드립니다.
                </p>
              </div>
            </div>

            <div>
              <h2 className="mb-6 text-[1.6rem] font-semibold tracking-[-0.03em] text-[#2f241d] sm:mb-8 sm:text-[2.2rem]">
                상담 요청 폼
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div>
                  <label className="mb-3 block text-[11px] uppercase tracking-[0.2em] text-[#8f7d70]">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                    placeholder="상호 또는 성함을 입력해 주세요"
                    className="min-h-[52px] w-full border-b border-[#d7c8b8] bg-transparent px-0 py-4 text-[15px] text-[#33261f] placeholder:text-[#a99b8f] focus:border-[#8d6a49] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-[11px] uppercase tracking-[0.2em] text-[#8f7d70]">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="연락 가능한 번호를 입력해 주세요"
                    className="min-h-[52px] w-full border-b border-[#d7c8b8] bg-transparent px-0 py-4 text-[15px] text-[#33261f] placeholder:text-[#a99b8f] focus:border-[#8d6a49] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-[11px] uppercase tracking-[0.2em] text-[#8f7d70]">Interest</label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData((prev) => ({ ...prev, interest: e.target.value }))}
                    className="min-h-[52px] w-full cursor-pointer border-b border-[#d7c8b8] bg-transparent px-0 py-4 text-[15px] text-[#33261f] focus:border-[#8d6a49] focus:outline-none"
                  >
                    {interestOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-3 block text-[11px] uppercase tracking-[0.2em] text-[#8f7d70]">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="문의 내용을 입력해 주세요"
                    rows={5}
                    className="w-full resize-none border-b border-[#d7c8b8] bg-transparent px-0 py-4 text-[15px] text-[#33261f] placeholder:text-[#a99b8f] focus:border-[#8d6a49] focus:outline-none"
                  />
                </div>

                <label className="flex items-start gap-3 border-y border-[#dfd0bf] py-4 text-[14px] leading-7 text-[#6b5c4f]">
                  <input
                    type="checkbox"
                    checked={formData.privacyConsent}
                    onChange={(e) => setFormData((prev) => ({ ...prev, privacyConsent: e.target.checked }))}
                    className="mt-1 h-5 w-5 shrink-0"
                  />
                  <span>
                    상담 요청 처리를 위해 개인정보 수집 및 이용에 동의합니다. 자세한 내용은 개인정보처리방침을 확인해 주세요.
                  </span>
                </label>

                {error ? (
                  <p className="border-l-2 border-red-500 pl-4 text-sm leading-6 text-red-700">{error}</p>
                ) : null}

                {success ? (
                  <p className="border-l-2 border-emerald-600 pl-4 text-sm leading-6 text-emerald-700">{success}</p>
                ) : null}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-h-[54px] w-full bg-[#3d2d24] px-6 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#2f241d] disabled:opacity-60"
                  >
                    {isSubmitting ? '접수 중...' : '상담 요청'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#dfd0bf] px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-[1.9rem] font-semibold tracking-[-0.03em] text-[#2f241d] sm:text-[2.35rem]">방문 예약</h2>
          <p className="mb-10 max-w-xl text-[15px] leading-7 text-[#6b5c4f] sm:text-[16px]">
            매장 방문을 원하시는 경우 사전 예약을 부탁드립니다. 예약 시 더욱 세심한 상담이 가능합니다.
          </p>
          <div className="flex max-w-md flex-col gap-4 sm:max-w-none sm:flex-row sm:gap-4">
            <a
              href={`tel:${settings.phonePrimary.replace(/\s+/g, '')}`}
              className="inline-flex min-h-[52px] items-center justify-center bg-[#3d2d24] px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#2f241d]"
            >
              전화 예약
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="inline-flex min-h-[52px] items-center justify-center border border-[#cdbba8] px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-[#3d2d24] transition-all duration-300 hover:border-[#8d6a49] hover:text-[#8d6a49]"
            >
              이메일 문의
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

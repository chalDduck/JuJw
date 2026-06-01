'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  CreditCard,
  MessageCircle,
  FileText,
  Instagram,
  Menu,
  Package,
  RefreshCw,
  ShieldCheck,
  Truck,
  Wrench,
  X,
} from 'lucide-react'
import ShowcaseImage from '@/components/media/ShowcaseImage'
import { processSteps, tradeTerms } from '@/content/static'
import { cn } from '@/lib/utils'
import { KAKAO_OPENCHAT_URL } from '@/lib/site-links'
import type { SiteSettings } from '@/lib/site-settings'

type TradeInformationPageProps = {
  settings: SiteSettings
}

const navigation = [
  { label: '컬렉션', href: '/products' },
  { label: '브랜드 스토리', href: '/about' },
  { label: '거래 안내', href: '/trade' },
  { label: '오시는 길', href: '/location' },
  { label: 'FAQ', href: '/faq' },
] as const

const iconMap = {
  package: Package,
  'credit-card': CreditCard,
  truck: Truck,
  'refresh-cw': RefreshCw,
  wrench: Wrench,
  'file-text': FileText,
}

const guideHighlights = [
  { title: '결제 방식 안내', description: '주문 규모와 진행 방식에 맞춰 결제 흐름을 안내합니다.' },
  { title: '재고품 빠른 출고', description: '재고 보유 제품은 당일 또는 익일 출고 기준으로 안내합니다.' },
  { title: '제품 상태 확인', description: '수령 후 상태 확인을 기준으로 교환 가능 범위를 안내합니다.' },
  { title: 'A/S 접수 안내', description: '구매 이력 확인 후 수리 가능 범위와 비용을 차분하게 설명합니다.' },
] as const

const summaryGroups = [
  {
    title: '주문과 결제',
    items: ['첫 거래도 소량부터 상담 가능', '현금, 카드, 계좌이체 가능', '결제 조건은 상담 시 안내'],
  },
  {
    title: '배송과 수령',
    items: ['전국 택배 발송 및 방문 수령 가능', '재고품은 당일 또는 익일 출고', '안전 포장 후 출고 일정 별도 안내'],
  },
  {
    title: '교환과 A/S',
    items: ['수령 후 제품 상태 확인', '주문 제작 품목은 별도 협의', '구매 이력 확인 후 수리 접수 안내'],
  },
] as const

const footerColumns = [
  {
    title: 'SHOP',
    items: ['컬렉션', '목걸이', '귀걸이', '반지', '팔찌'],
  },
  {
    title: 'GUIDE',
    items: ['거래 안내', '배송 기준', '교환/반품', 'A/S 안내'],
  },
  {
    title: 'ABOUT',
    items: ['브랜드 스토리', '상담 문의', '오시는 길', 'FAQ'],
  },
] as const

export default function TradeInformationPage({ settings }: TradeInformationPageProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.add('trade-reference-page')

    return () => {
      document.body.classList.remove('trade-reference-page')
      document.body.style.removeProperty('overflow')
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.removeProperty('overflow')
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.removeProperty('overflow')
    }
  }, [menuOpen])

  const socialLinks = [
    { href: settings.instagramUrl || '/contact', label: 'Instagram', Icon: Instagram },
    { href: KAKAO_OPENCHAT_URL, label: '카카오톡', Icon: MessageCircle },
  ]

  return (
    <div data-trade-shell className="bg-[#f6f1ea] text-[#433228]">
      <div
        className={cn(
          'fixed inset-0 z-[70] transition-all duration-300',
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <button
          type="button"
          aria-label="메뉴 닫기"
          className="absolute inset-0 bg-[#120d09]/76 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <aside
          className={cn(
            'absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-[#2e2119] px-7 py-7 text-white transition-transform duration-300 sm:px-9',
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="brand-wordmark text-[2rem] leading-none tracking-[0.08em] text-white">Ju</span>
            <button type="button" aria-label="메뉴 닫기" onClick={() => setMenuOpen(false)} className="p-2 text-white/80">
              <X size={22} strokeWidth={1.7} />
            </button>
          </div>

          <div className="mt-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#d8b78c]">Explore</p>
            <nav className="mt-5 border-t border-white/10">
              {navigation.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between border-b border-white/10 py-5"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="text-[1.55rem] font-semibold leading-none">{item.label}</span>
                  <span className="text-[11px] tracking-[0.24em] text-white/38">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto border-t border-white/10 pt-6">
            <p className="text-[13px] leading-7 text-white/70">
              거래 문의와 납기 상담은 연락처를 남겨 주시면 조건에 맞춰 바로 안내드립니다.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-3 border border-[#c59a69] px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-[#f5e3cb]"
              onClick={() => setMenuOpen(false)}
            >
              상담 예약
              <ArrowRight size={15} strokeWidth={1.7} />
            </Link>
          </div>
        </aside>
      </div>

      <section className="relative isolate min-h-[560px] overflow-hidden bg-[#5d483a] sm:min-h-[620px] md:min-h-[760px]">
        <ShowcaseImage
          src="/img/trade-generated/trade-hero-desktop.png"
          mobileSrc="/img/trade-generated/trade-hero-mobile.png"
          alt="거래 안내 히어로 이미지"
          loading="eager"
          className="absolute inset-0 h-full w-full bg-[#5d483a]"
          imageClassName="object-cover object-center md:object-[68%_50%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(62,45,34,0.84)_0%,rgba(62,45,34,0.58)_38%,rgba(62,45,34,0.2)_100%)]" />

        <div className="absolute inset-x-0 top-0 z-20">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
            <Link href="/" className="brand-wordmark text-[2rem] leading-none tracking-[0.08em] text-white">
              Ju
            </Link>
            <div className="flex items-center gap-5 text-white">
              <button type="button" aria-label="메뉴 열기" className="transition-opacity hover:opacity-80" onClick={() => setMenuOpen(true)}>
                <Menu size={24} strokeWidth={1.7} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-[1440px] items-center px-5 pb-16 pt-24 sm:min-h-[620px] sm:px-6 sm:pb-20 sm:pt-28 md:min-h-[760px] md:px-10 md:pt-32">
          <div className="max-w-[470px] text-white">
            <div className="mb-5 flex items-center gap-4 text-[#dfc7aa]">
              <span className="h-px w-12 bg-current/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-current/80" />
              <span className="h-px w-20 bg-current/35" />
            </div>
            <h1 className="text-[2.65rem] font-semibold leading-[1.14] sm:text-[4.1rem]">거래 안내</h1>
            <p className="mt-6 text-[1rem] leading-8 text-[#f1e6da] sm:text-[1.12rem] sm:leading-9">
              주문, 결제, 배송, 교환과 A/S까지
              <br />
              실제 거래 흐름에 맞춰 간단하게 정리했습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e4d9cd] bg-[#fbf8f4]">
        <div className="mx-auto grid max-w-[1320px] gap-0 px-4 py-5 sm:px-6 md:grid-cols-4 md:px-8">
          {guideHighlights.map((item, index) => (
            <article
              key={item.title}
              className={cn(
                'px-4 py-5 md:px-6',
                index < guideHighlights.length - 1 && 'border-b border-[#e7ddd1] md:border-b-0 md:border-r'
              )}
            >
              <p className="text-[15px] font-semibold text-[#5d483a]">{item.title}</p>
              <p className="mt-2 text-[13px] leading-6 text-[#7a6858]">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-8 md:grid-cols-[0.94fr_1.06fr] md:items-center md:gap-10">
          <div className="px-2 md:px-0">
            <h2 className="text-[2.2rem] font-semibold leading-[1.28] text-[#3e2d23] sm:text-[2.85rem]">
              필요한 기준만 바로 확인할 수 있게
            </h2>
            <div className="mt-5 h-px w-16 bg-[#d0b69b]" />
            <div className="mt-7 max-w-[34rem] space-y-4 text-[15px] leading-8 text-[#6d5a4b] sm:text-[16px]">
              <p>첫 문의에서 필요한 것은 최소 주문, 결제 방식, 출고 시점, 교환 조건입니다. 거래 안내는 그 네 가지를 먼저 읽히도록 구성했습니다.</p>
              <p>불필요한 설명을 줄이고, 실제 상담에서 자주 묻는 기준만 남겨 빠르게 판단할 수 있도록 정리했습니다.</p>
            </div>
          </div>

          <ShowcaseImage
            src="/img/trade-generated/trade-terms-panel.png"
            alt="거래 안내 비주얼 패널"
            className="min-h-[300px] overflow-hidden border border-[#e3d6c8] bg-[#efe7dc] md:min-h-[380px]"
            imageClassName="object-cover object-center"
          />
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-8 md:pb-16">
        <div className="mx-auto grid max-w-[1320px] border-y border-[#dfd0bf] md:grid-cols-2">
          {tradeTerms.map((term, index) => {
            const Icon = iconMap[term.icon as keyof typeof iconMap]

            return (
              <article
                key={term.title}
                className={cn(
                  'px-2 py-7 md:px-8',
                  index < tradeTerms.length - 1 && 'border-b border-[#dfd0bf]',
                  index % 2 === 0 && 'md:border-r md:border-[#dfd0bf]',
                  index === tradeTerms.length - 2 && 'md:border-b-0'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-medium tracking-[0.16em] text-[#b18a69]">GUIDE</p>
                    <h3 className="mt-3 text-[1.35rem] font-semibold leading-[1.35] text-[#433228]">{term.title}</h3>
                  </div>
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-[#dfd1c2] text-[#9b7757]">
                    <Icon size={21} strokeWidth={1.7} />
                  </div>
                </div>
                <p className="mt-5 text-[15px] font-medium leading-7 text-[#5d483a]">{term.description}</p>
                <p className="mt-3 text-[14px] leading-7 text-[#7a6858]">{term.details}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 md:px-8 md:py-14">
        <div className="mx-auto max-w-[1320px] border-y border-[#dfd0bf] px-2 py-10 sm:px-4 md:px-6">
          <div>
            <h2 className="text-[2rem] font-semibold leading-[1.28] text-[#3e2d23] sm:text-[2.55rem]">거래 진행 순서</h2>
            <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-[#776352]">
              문의부터 출고까지, 실제 상담에서 오가는 순서대로 정리했습니다. 첫 거래일수록 단계가 간단히 보여야 판단이 빠릅니다.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 md:mt-10 md:grid-cols-5 md:gap-6">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative text-center md:px-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d8c7b6] text-[15px] text-[#9f7e63]">
                  {step.step}
                </div>
                <h3 className="mt-4 text-[1.2rem] font-semibold leading-none text-[#46352a]">{step.title}</h3>
                <p className="mt-4 text-[14px] leading-6 text-[#7a6858]">{step.description}</p>
                {index < processSteps.length - 1 ? (
                  <span className="absolute right-[-0.5rem] top-6 hidden text-[#b69c84] md:block">
                    <ArrowRight size={16} strokeWidth={1.5} />
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <div className="mx-auto grid max-w-[1320px] overflow-hidden border border-[#dbcdbf] md:grid-cols-[1.04fr_0.96fr]">
          <div className="flex items-center bg-[#3a2b23] px-6 py-8 text-white sm:px-8 sm:py-10 md:px-10 md:py-12">
            <div className="max-w-[430px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[12px] text-[#e4d2c3]">
                <ShieldCheck size={15} strokeWidth={1.7} />
                배송, 교환, A/S 기준
              </div>
              <h2 className="mt-6 text-[2.2rem] font-semibold leading-[1.28] sm:text-[2.55rem]">
                기준은 단순하게, 안내는 명확하게
              </h2>
              <div className="mt-6 space-y-5 text-[14px] leading-7 text-white/78">
                {summaryGroups.map((group) => (
                  <div key={group.title} className="border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
                    <p className="text-[15px] font-semibold text-white">{group.title}</p>
                    <ul className="mt-3 space-y-2">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ShowcaseImage
            src="/img/trade-generated/trade-service-panel.png"
            alt="배송 및 서비스 안내 비주얼"
            className="min-h-[320px] md:min-h-[520px]"
            imageClassName="object-cover object-center"
          />
        </div>
      </section>

      <section className="px-4 pb-0 pt-4 sm:px-6 md:px-8 md:pt-8">
        <div className="mx-auto grid max-w-[1440px] overflow-hidden border border-[#decfbe] bg-[#f8f3ed] md:grid-cols-[0.92fr_1.08fr_0.84fr]">
          <ShowcaseImage
            src="/img/trade-generated/trade-cta-panel.png"
            alt="거래 상담 안내 이미지"
            className="min-h-[220px]"
            imageClassName="object-cover object-center"
          />

          <div className="flex items-center px-6 py-8 sm:px-8 sm:py-10 md:px-10">
            <div>
              <h2 className="text-[2rem] font-semibold leading-[1.28] text-[#3e2d23] sm:text-[2.45rem]">
                조건 확인 후 바로 상담할 수 있습니다
              </h2>
              <p className="mt-5 max-w-[440px] text-[15px] leading-7 text-[#71604f]">
                품목, 수량, 납기, 예산 범위를 남겨 주시면 거래 기준에 맞춰 빠르게 정리해 드립니다.
              </p>
              <div className="mt-6 space-y-2 text-[14px] leading-6 text-[#6d5a4b]">
                <p>{settings.phonePrimary}</p>
                <p>{settings.email}</p>
                <p>{settings.businessHours}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 border-t border-[#decfbe] px-6 py-6 sm:gap-4 sm:px-8 sm:py-8 md:border-l md:border-t-0">
            <Link
              href="/contact"
              className="inline-flex min-h-[58px] items-center justify-center gap-3 bg-[#4b382d] px-6 text-[14px] tracking-[0.08em] text-white transition-colors hover:bg-[#3f2f26]"
            >
              상담 요청하기
              <ArrowRight size={16} strokeWidth={1.7} />
            </Link>
            <Link
              href="/faq"
              className="inline-flex min-h-[58px] items-center justify-center gap-3 border border-[#bba188] bg-white px-6 text-[14px] tracking-[0.08em] text-[#5f4b3d] transition-colors hover:bg-[#faf6f1]"
            >
              FAQ 보기
              <ArrowRight size={16} strokeWidth={1.7} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#3a2b23] text-[#ede1d5]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-10 sm:px-8 md:grid-cols-[1.3fr_0.85fr_0.85fr_0.85fr_1fr] md:px-10">
          <div>
            <p className="brand-wordmark text-[2.25rem] leading-none tracking-[0.08em] text-white">Ju</p>
            <p className="mt-4 max-w-[260px] text-[14px] leading-7 text-white/70">
              거래 기준과 제품 상담을 같은 톤으로 정리해, 빠르게 판단할 수 있도록 안내합니다.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.Icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 text-white/82 transition-colors hover:border-white/28 hover:text-white"
                  >
                    <Icon size={18} strokeWidth={1.7} />
                  </Link>
                )
              })}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="hidden md:block">
              <p className="text-[13px] font-medium tracking-[0.14em] text-[#d3b89c]">{column.title}</p>
              <ul className="mt-4 space-y-2 text-[14px] leading-7 text-white/68">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-[13px] font-medium tracking-[0.14em] text-[#d3b89c]">CONTACT</p>
            <ul className="mt-4 space-y-2 text-[14px] leading-7 text-white/68">
              <li>{settings.phonePrimary}</li>
              {settings.phoneSecondary ? <li>{settings.phoneSecondary}</li> : null}
              <li>{settings.businessHours}</li>
              <li>{settings.email}</li>
              <li>{settings.address}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-5 text-[13px] text-white/48 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10">
            <p>© Ju Jewelry. All rights reserved.</p>
            <div className="flex flex-wrap gap-5">
              <Link href="/terms" className="transition-colors hover:text-white/72">
                이용약관
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-white/72">
                개인정보처리방침
              </Link>
              <Link href="/contact" className="transition-colors hover:text-white/72">
                상담 문의
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

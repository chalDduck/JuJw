'use client'

import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'
import { ArrowRight, Facebook, Instagram, Menu, X } from 'lucide-react'
import ShowcaseImage from '@/components/media/ShowcaseImage'
import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/lib/site-settings'

const navigation = [
  { label: '컬렉션', href: '/products' },
  { label: '브랜드 스토리', href: '/about' },
  { label: '거래 안내', href: '/trade' },
  { label: '오시는 길', href: '/location' },
  { label: '공지사항', href: '/notices' },
  { label: 'FAQ', href: '/faq' },
] as const

const footerColumns = [
  { title: 'SHOP', items: ['컬렉션', '목걸이', '귀걸이', '반지', '팔찌'] },
  { title: 'GUIDE', items: ['거래 안내', '공지사항', '교환/반품', 'A/S 안내'] },
  { title: 'ABOUT', items: ['브랜드 스토리', '상담 문의', '오시는 길', 'FAQ'] },
] as const

type NoticesShellProps = {
  settings: SiteSettings
  heroTitle: string
  heroSubtitle?: string
  heroKicker?: string
  summaryItems?: Array<{ label: string; value: string }>
  contentWidth?: 'wide' | 'narrow'
  children: ReactNode
}

export default function NoticesShell({
  settings,
  heroTitle,
  heroSubtitle,
  heroKicker = 'Notice',
  summaryItems = [],
  contentWidth = 'wide',
  children,
}: NoticesShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.add('notices-reference-page')
    return () => {
      document.body.classList.remove('notices-reference-page')
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
    { href: settings.facebookUrl || '/contact', label: 'Facebook', Icon: Facebook },
  ]

  return (
    <div data-notices-shell className="bg-[#f6f1ea] text-[#433228]">
      {/* 슬라이드 메뉴 */}
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
            <p className="font-display text-[11px] font-medium uppercase tracking-[0.28em] text-[#d8b78c]">Explore</p>
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
              궁금한 점은 문의 페이지에서 편하게 남겨 주세요. 확인 후 빠르게 안내드립니다.
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

      <section className="relative isolate min-h-[560px] overflow-hidden bg-[#4b382d] sm:min-h-[620px] md:min-h-[760px]">
        <ShowcaseImage
          src="/img/notices-generated/notices-hero-desktop.png"
          mobileSrc="/img/notices-generated/notices-hero-mobile.png"
          alt="공지사항 히어로 이미지"
          loading="eager"
          className="absolute inset-0 h-full w-full bg-[#4b382d]"
          imageClassName="object-cover object-center md:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(38,25,18,0.92)_0%,rgba(48,33,24,0.72)_34%,rgba(49,35,26,0.28)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_44%,rgba(255,226,190,0.12),transparent_25%)]" />

        <div className="absolute inset-x-0 top-0 z-20">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
            <Link href="/" className="brand-wordmark text-[2rem] leading-none tracking-[0.08em] text-white">
              Ju
            </Link>
            <button
              type="button"
              aria-label="메뉴 열기"
              className="text-white transition-opacity hover:opacity-80"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={24} strokeWidth={1.7} />
            </button>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-[1440px] items-center px-5 pb-16 pt-24 sm:min-h-[620px] sm:px-6 sm:pb-20 sm:pt-28 md:min-h-[760px] md:px-10 md:pt-32">
          <div className="max-w-[520px] text-white">
            <div className="mb-5 flex items-center gap-4 text-[#dfc7aa]">
              <span className="h-px w-12 bg-current/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-current/80" />
              <span className="h-px w-20 bg-current/35" />
            </div>
            <p className="font-display text-[11px] font-medium uppercase tracking-[0.28em] text-[#dfc7aa]">
              {heroKicker}
            </p>
            <h1 className="mt-5 text-[2.65rem] font-semibold leading-[1.14] sm:text-[4.1rem]">{heroTitle}</h1>
            {heroSubtitle ? (
              <p className="mt-6 text-[1rem] leading-8 text-[#f1e6da] sm:text-[1.12rem] sm:leading-9">{heroSubtitle}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] items-center justify-center gap-3 border border-[#d3b18a] px-5 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#f5e3cb] transition-colors hover:bg-white/10"
              >
                문의하기
                <ArrowRight size={15} strokeWidth={1.7} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {summaryItems.length > 0 ? (
        <section className="border-b border-[#e4d9cd] bg-[#fbf8f4]">
          <div className="mx-auto grid max-w-[1320px] gap-0 px-4 py-5 sm:px-6 md:grid-cols-3 md:px-8">
            {summaryItems.map((item, index) => (
              <article
                key={item.label}
                className={cn(
                  'border-b border-[#e7ddd1] px-4 py-5 md:border-b-0 md:px-6',
                  index < summaryItems.length - 1 ? 'md:border-r' : ''
                )}
              >
                <p className="text-[13px] font-semibold tracking-[0.12em] text-[#a77c52]">{item.label}</p>
                <p className="mt-2 text-[14px] leading-7 text-[#5d483a]">{item.value}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* 본문 */}
      <section className="px-4 py-12 sm:px-6 md:px-8 md:py-16">
        <div className={cn('mx-auto', contentWidth === 'narrow' ? 'max-w-3xl' : 'max-w-[1120px]')}>
          {children}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-[#3a2b23] text-[#ede1d5]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-10 sm:px-8 md:grid-cols-[1.3fr_0.85fr_0.85fr_0.85fr_1fr] md:px-10">
          <div>
            <p className="brand-wordmark text-[2.25rem] leading-none tracking-[0.08em] text-white">Ju</p>
            <p className="mt-4 max-w-[260px] text-[14px] leading-7 text-white/70">
              {settings.homeFooterNote || '오래 착용할 수 있는 빛을 Ju의 시선으로 제안합니다.'}
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
              <p className="font-display text-[13px] font-medium tracking-[0.14em] text-[#d3b89c]">{column.title}</p>
              <ul className="mt-4 space-y-2 text-[14px] leading-7 text-white/68">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="font-display text-[13px] font-medium tracking-[0.14em] text-[#d3b89c]">CONTACT</p>
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
            <p>© 2026 {settings.shopName || 'Ju Jewelry'}. All rights reserved.</p>
            <div className="flex flex-wrap gap-5">
              <Link href="/terms" className="transition-colors hover:text-white/72">이용약관</Link>
              <Link href="/privacy" className="transition-colors hover:text-white/72">개인정보처리방침</Link>
              <Link href="/contact" className="transition-colors hover:text-white/72">상담 문의</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

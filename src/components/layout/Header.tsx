'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { label: '컬렉션', href: '/products' },
  { label: '브랜드 스토리', href: '/about' },
  { label: '거래 안내', href: '/trade' },
  { label: '오시는 길', href: '/location' },
  { label: '공지사항', href: '/notices' },
  { label: 'FAQ', href: '/faq' },
] as const

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.removeProperty('overflow')
      return
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [menuOpen])

  if (pathname.startsWith('/admin') || pathname === '/' || pathname === '/faq') {
    return null
  }

  return (
    <>
      <header data-site-header className="fixed inset-x-0 top-0 z-[70]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <Link
            href="/"
            className="brand-wordmark text-[2rem] leading-none tracking-[0.08em] text-[#2f2119] transition-opacity hover:opacity-72"
          >
            Ju
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center text-[#2f2119] transition-opacity hover:opacity-72"
          >
            {menuOpen ? <X size={22} strokeWidth={1.7} /> : <Menu size={22} strokeWidth={1.7} />}
          </button>
        </div>
      </header>

      <div
        data-site-header-overlay
        className={cn('fixed inset-0 z-[70] transition-all duration-300', menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0')}
      >
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-[#120d09]/76 backdrop-blur-sm"
        />

        <aside
          className={cn(
            'absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-[#2e2119] px-7 py-7 text-white transition-transform duration-300 sm:px-9',
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="brand-wordmark text-[2rem] leading-none tracking-[0.08em] text-white">
              Ju
            </span>
            <button
              type="button"
              aria-label="메뉴 닫기"
              onClick={() => setMenuOpen(false)}
              className="p-2 text-white/80"
            >
              <X size={22} strokeWidth={1.7} />
            </button>
          </div>

          <div className="mt-10">
            <p className="font-display text-[11px] uppercase tracking-[0.28em] text-[#d8b78c]">
              Explore
            </p>
            <nav className="mt-5 border-t border-white/10">
              {navigation.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between border-b border-white/10 py-5"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="font-display text-[1.75rem] leading-none">{item.label}</span>
                  <span className="text-[11px] tracking-[0.24em] text-white/38">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto border-t border-white/10 pt-6">
            <p className="text-[13px] leading-7 text-white/70">
              컬렉션 비교와 선물 상담은 문의 페이지에서 바로 예약할 수 있습니다.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-3 border border-[#c59a69] px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-[#f5e3cb] transition-colors hover:bg-white/8"
              onClick={() => setMenuOpen(false)}
            >
              상담 예약
              <ArrowRight size={15} strokeWidth={1.7} />
            </Link>
          </div>
        </aside>
      </div>
    </>
  )
}

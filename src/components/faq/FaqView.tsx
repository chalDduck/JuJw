'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, Menu, MoveRight, X } from 'lucide-react'
import ShowcaseImage from '@/components/media/ShowcaseImage'
import { cn } from '@/lib/utils'
import type { FaqCategory, FaqItem } from '@/lib/faq'

const navigation = [
  { label: '컬렉션', href: '/products' },
  { label: '브랜드 스토리', href: '/about' },
  { label: '거래 안내', href: '/trade' },
  { label: '오시는 길', href: '/location' },
  { label: '공지사항', href: '/notices' },
  { label: 'FAQ', href: '/faq' },
] as const

type FaqViewProps = {
  faqs: FaqItem[]
  categories: FaqCategory[]
}

export default function FaqView({ faqs, categories }: FaqViewProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null)
  const [menuOpen, setMenuOpen] = useState(false)

  const filteredFaqs = useMemo(
    () => (activeCategory === 'all' ? faqs : faqs.filter((faq) => faq.category === activeCategory)),
    [activeCategory, faqs]
  )

  const activeCategoryMeta =
    categories.find((category) => category.id === activeCategory) ?? categories[0]

  useEffect(() => {
    if (!filteredFaqs.some((faq) => faq.id === openId)) {
      setOpenId(filteredFaqs[0]?.id ?? null)
    }
  }, [filteredFaqs, openId])

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

  return (
    <div data-faq-shell className="bg-[#f6f1ea] text-[#433228]">
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
                  <span className="font-display text-[1.55rem] font-semibold leading-none">{item.label}</span>
                  <span className="text-[11px] tracking-[0.24em] text-white/38">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto border-t border-white/10 pt-6">
            <p className="text-[13px] leading-7 text-white/70">
              원하는 답을 찾지 못했다면 문의 페이지에서 상황에 맞는 상담을 요청할 수 있습니다.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-3 border border-[#c59a69] px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-[#f5e3cb]"
              onClick={() => setMenuOpen(false)}
            >
              문의하기
              <ArrowRight size={15} strokeWidth={1.7} />
            </Link>
          </div>
        </aside>
      </div>

      <section className="relative isolate min-h-[560px] overflow-hidden bg-[#5d483a] sm:min-h-[620px] md:min-h-[760px]">
        <ShowcaseImage
          src="/img/faq-generated/faq-hero-desktop.png"
          mobileSrc="/img/faq-generated/faq-hero-mobile.png"
          alt="자주 묻는 질문 히어로 주얼리 상담 이미지"
          loading="eager"
          className="absolute inset-0 h-full w-full bg-[#5d483a]"
          imageClassName="object-cover object-center md:object-[58%_50%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,32,22,0.86)_0%,rgba(61,42,29,0.66)_38%,rgba(62,45,34,0.2)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_42%,rgba(255,228,196,0.12),transparent_23%)]" />

        <div className="absolute inset-x-0 top-0 z-20">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
            <Link href="/" className="brand-wordmark text-[2rem] leading-none tracking-[0.08em] text-white">
              Ju
            </Link>
            <button type="button" aria-label="메뉴 열기" className="text-white transition-opacity hover:opacity-80" onClick={() => setMenuOpen(true)}>
              <Menu size={24} strokeWidth={1.7} />
            </button>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-[1440px] items-center px-5 pb-16 pt-24 sm:min-h-[620px] sm:px-6 sm:pb-20 sm:pt-28 md:min-h-[760px] md:px-10 md:pt-32">
          <div className="max-w-[500px] text-white">
            <div className="mb-5 flex items-center gap-4 text-[#dfc7aa]">
              <span className="h-px w-12 bg-current/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-current/80" />
              <span className="h-px w-20 bg-current/35" />
            </div>
            <p className="font-display text-[11px] font-medium uppercase tracking-[0.28em] text-[#dfc7aa]">FAQ</p>
            <h1 className="mt-5 text-[2.65rem] font-semibold leading-[1.14] sm:text-[4.1rem]">
              자주 묻는 질문
            </h1>
            <p className="mt-6 text-[1rem] leading-8 text-[#f1e6da] sm:text-[1.12rem] sm:leading-9">
              주문, 제품, 배송, A/S 기준을
              <br />
              목록에서 빠르게 확인할 수 있게 정리했습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden px-4 py-12 sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[1180px] min-w-0 gap-9 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <p className="font-display text-[12px] font-medium uppercase tracking-[0.2em] text-[#b38b5d]">
              Question Index
            </p>
            <h2 className="mt-4 text-[1.75rem] font-semibold leading-[1.32] text-[#32261f]">
              {activeCategoryMeta.name}
            </h2>
            <p className="mt-4 text-[14px] leading-7 text-[#6d5f54]">
              {activeCategoryMeta.description}
            </p>

            <div className="-mx-4 mt-7 flex max-w-[100vw] gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide sm:mx-0 sm:max-w-full sm:px-0 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
              {categories.map((category) => {
                const isActive = activeCategory === category.id

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      'min-w-[104px] shrink-0 border border-[#dfd0bf] px-4 py-3 text-left text-[14px] transition-colors lg:w-full lg:min-w-0',
                      isActive
                        ? 'border-[#6d4f3d] bg-[#4b382d] text-white'
                        : 'bg-transparent text-[#6f6155] hover:border-[#bda182] hover:text-[#4a3b31]'
                    )}
                  >
                    {category.name}
                  </button>
                )
              })}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-col gap-3 border-b border-[#d8c9b8] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-display text-[12px] font-medium uppercase tracking-[0.18em] text-[#b38b5d]">
                  {filteredFaqs.length} Questions
                </p>
                <h2 className="mt-3 max-w-full break-words text-[1.55rem] font-semibold leading-[1.32] text-[#32261f] [overflow-wrap:anywhere] sm:break-keep sm:text-[2.25rem]">
                  필요한 답변을 목록에서 바로 확인하세요
                </h2>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-[#4a382d] transition-colors hover:text-[#2f241d]"
              >
                직접 문의
                <MoveRight size={15} strokeWidth={1.8} />
              </Link>
            </div>

            <div className="min-w-0 divide-y divide-[#dfd0bf] border-b border-[#dfd0bf]">
              {filteredFaqs.map((faq, index) => {
                const categoryName =
                  categories.find((category) => category.id === faq.category)?.name ?? '질문'
                const isOpen = openId === faq.id

                return (
                  <article key={faq.id}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      className="flex w-full min-w-0 items-start gap-3 py-5 text-left sm:grid sm:grid-cols-[4.75rem_8.5rem_minmax(0,1fr)_auto] sm:gap-5 sm:py-7"
                    >
                      <span className="shrink-0 pt-1 text-[12px] font-medium uppercase tracking-[0.16em] text-[#b38b5d]">
                        Q{String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="hidden pt-1 text-[12px] leading-6 text-[#8f7e6e] sm:block">
                        {categoryName}
                      </span>
                      <div className="min-w-0 flex-1 sm:flex-none">
                        <span className="mb-2 inline-flex text-[11px] uppercase tracking-[0.16em] text-[#8f7e6e] sm:hidden">
                          {categoryName}
                        </span>
                        <h3 className="break-words text-[17px] font-semibold leading-7 text-[#2f241d] [overflow-wrap:anywhere] sm:break-keep sm:text-[20px] sm:leading-8">
                          {faq.question}
                        </h3>
                      </div>
                      <ChevronDown
                        size={18}
                        className={cn(
                          'mt-1 shrink-0 text-[#8f7e6e] transition-transform duration-300',
                          isOpen && 'rotate-180'
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      )}
                    >
                      <div className="overflow-hidden">
                        <div
                          id={`faq-answer-${faq.id}`}
                          className="pb-6 pr-1 text-[14px] leading-7 text-[#66584c] sm:pb-7 sm:pl-[13.25rem] sm:pr-12 sm:text-[15px] sm:leading-8"
                        >
                          <p className="max-w-[720px] break-words border-l border-[#cfbda9] pl-4 [overflow-wrap:anywhere] sm:break-keep sm:pl-5">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="mt-10 flex flex-col gap-5 border-y border-[#d8c9b8] py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-[18px] font-semibold text-[#31251f]">원하는 답이 없다면 문의해 주세요.</h3>
                <p className="mt-2 text-[14px] leading-7 text-[#6d5f54]">
                  제품 비교, 거래 조건, 방문 상담처럼 상황에 맞는 내용을 바로 안내해 드립니다.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex min-h-[52px] items-center justify-center gap-3 bg-[#4b382d] px-6 text-[14px] tracking-[0.08em] text-white transition-colors hover:bg-[#3f2f26]"
              >
                문의하기
                <ArrowRight size={16} strokeWidth={1.7} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
